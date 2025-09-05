import { useCallback, useEffect, useRef, useState, useMemo } from "react";

import { Layout, Link, Locator, Publication } from "@readium/shared";

export interface TocItem {
  id: string;
  href: string;
  title?: string;
  children?: TocItem[];
  position?: number;
}

export interface TimelineItem {
  href: string;
  title?: string;
  fragments?: string[];
  positionRange?: [number, number?];
  progressionRange?: [number, number?];
  totalProgressionRange?: [number, number?];
  children?: TimelineItem[];
}

export interface UnstableTimeline {
  items?: {
    [href: string]: TimelineItem;
  };
  toc?: {
    tree?: TocItem[];
    currentEntry?: string | null;
  };
  currentItem?: TimelineItem | null;
  previousItem?: TimelineItem | null;
  nextItem?: TimelineItem | null;
  progression?: {
    totalPositions: number;
    currentPositions: number[];
    relativeProgression?: number;
    totalProgression?: number;
    currentChapter?: string;
    positionsLeft: number;
  };
}

export let timelineInstance: UnstableTimeline | undefined;

export const useTimeline = ({
  publication, 
  currentLocation, 
  currentPositions,
  positionsList,
  onChange
}: {
  publication: Publication | null, 
  currentLocation?: Locator, 
  currentPositions: number[],
  positionsList: Locator[],
  onChange?: (timeline: UnstableTimeline) => void
}): UnstableTimeline => {
  const layout = publication?.metadata.effectiveLayout || Layout.reflowable;

  const [timelineItems, setTimelineItems] = useState<{ [href: string]: TimelineItem }>({});
  const [tocTree, setTocTree] = useState<TocItem[]>([]);
  const [currentTocEntry, setCurrentTocEntry] = useState<string | null>(null);
  const [currentItem, setCurrentItem] = useState<TimelineItem | null>(null);
  const [previousItem, setPreviousItem] = useState<TimelineItem | null>(null);
  const [nextItem, setNextItem] = useState<TimelineItem | null>(null);

  const idCounterRef = useRef(0);

  // Create the timeline object
  const timeline = useMemo(() => ({
    items: timelineItems,
    toc: {
      tree: tocTree,
      currentEntry: currentTocEntry
    },
    currentItem,
    previousItem,
    nextItem,
    progression: {
      totalPositions: positionsList.length,
      currentPositions: currentPositions || [],
      relativeProgression: currentLocation?.locations?.progression ?? currentItem?.progressionRange?.[0],
      totalProgression: currentLocation?.locations?.totalProgression ?? currentItem?.totalProgressionRange?.[0],
      currentChapter: currentItem?.title,
      positionsLeft: currentItem?.positionRange?.[1] && currentPositions[0] !== undefined
        ? Math.max(0, currentItem.positionRange[1] - currentPositions[0])
        : 0
    }
  }), [
    timelineItems,
    tocTree,
    currentTocEntry,
    currentItem,
    previousItem,
    nextItem,
    positionsList,
    currentPositions,
    currentLocation
  ]);

  const buildTocTree = useCallback((
    links: Link[],
    idGenerator: () => string,
    positionsList?: Locator[]
  ): TocItem[] => {
    return links.map((link) => {
      // Generate a new ID for the current Link
      const newId = idGenerator();
  
      // Create a plain object for compatibility with Tree components
      let href = link.href;
      const fragmentIndex = href.indexOf("#");
      if (fragmentIndex !== -1) {
        const baseHref = href.substring(0, fragmentIndex);
        const duplicateLink = links.find((l) => l.href.startsWith(baseHref) && l.href !== href);
        if (!duplicateLink) {
          href = baseHref;
        }
      }
  
      const treeNode: TocItem = {
        id: newId,
        href: href,
        title: link.title,
        position: positionsList?.find((position) => position.href === href)?.locations.position
      };
  
      // Recursively process children if they exist
      if (link.children) {
        treeNode.children = buildTocTree(link.children.items, idGenerator, positionsList);
      }
  
      return treeNode;
    });
  }, []);

  const handleTocEntryOnNav = useCallback((locator?: Locator) => {
    if (!locator || !tocTree.length) return;

    const findMatch = (items: TocItem[], link?: Link): TocItem | undefined => {
      for (const item of items) {
        if (item.href === link?.href) {
          return item;
        }
        if (item.children) {
          const match = findMatch(item.children, link);
          if (match) return match;
        }
      }
      return undefined;
    };

    const currentMatch = findMatch(tocTree, new Link(locator));
    if (currentMatch) {
      setCurrentTocEntry(currentMatch.id);
      return;
    }

    // If we're in FXL and didn't find a match, try to find a match for the other position in the spread
    if (layout === Layout.fixed) {
      const positions = currentPositions;
      if (positions && positions.length === 2) {
        const otherPosition = positions[0] === locator.locations.position ? positions[1] : positions[0];
        const otherPositionInList = positionsList.find((pos: Locator) => pos.locations.position === otherPosition);
        if (otherPositionInList) {
          const match = findMatch(tocTree, new Link(otherPositionInList));
          if (match) {
            setCurrentTocEntry(match.id);
            return;
          }
        }
      }
    }

    // If no match, try to find a match for other positions
    const otherPositions = currentPositions.filter(pos => pos !== locator.locations.position);
    for (const otherPosition of otherPositions) {
      const otherPositionInList = positionsList.find((pos: Locator) => pos.locations.position === otherPosition);
      if (otherPositionInList) {
        const match = findMatch(tocTree, new Link(otherPositionInList));
        if (match) {
          setCurrentTocEntry(match.id);
          return;
        }
      }
    }
  }, [tocTree, currentPositions, positionsList, layout]);

  const buildTimelineItems = useCallback(() => {
    const timelineItems: { [href: string]: TimelineItem } = {};
    const readingOrder = publication?.readingOrder?.items || [];
    const toc = publication?.toc?.items || [];
    const flatToc = toc.flatMap(t => [t, ...(t.children?.items || [])]);
  
    // Helper function to get URL base (without params and fragment)
    const getBaseUrl = (url: string): string => {
      const [base] = url.split("#");
      const [path] = base.split("?");
      return path;
    };

    // Function to find the first non-empty title by searching backward 
    // in flatToc from the current item"s position
    // The issue with this fallback is that for progressionOfResource
    // the progression is effectively scoped to the reading order item
    // so we have to differentiate using the index 
    const findNearestTitle = (currentHref: string): string => {
      const currentIndex = readingOrder.findIndex(item => getBaseUrl(item.href) === getBaseUrl(currentHref));
    
      if (currentIndex === -1) return "";
      
      for (let i = currentIndex; i >= 0; i--) {
        const item = readingOrder[i];
        // Find matching TOC items for this reading order item
        const matchingTocItems = flatToc.filter(t => 
          getBaseUrl(t.href) === getBaseUrl(item.href)
        );
        
        // If we have a matching TOC item with a title, return it with the difference in indices
        const title = matchingTocItems[0]?.title?.trim();
        if (title) {
          const diff = currentIndex - i;
          return diff > 0 ? `${ title } (${ diff + 1 })` : title;
        }
      }
      
      return "";
    };

    // Process reading order items
    for (const item of readingOrder) {
      // Find all matching TOC items (with or without fragment)
      const matchingTocItems = flatToc.filter(t => {
        const baseHref = getBaseUrl(t.href);
        const baseItemHref = getBaseUrl(item.href);
        return baseHref === baseItemHref;
      });

      // Create timeline item with all matching titles
      const timelineItem: TimelineItem = {
        href: item.href,
        title: item.title || matchingTocItems[0]?.title || findNearestTitle(item.href),
        fragments: matchingTocItems
          .map(t => t.href.split("#")[1])
          .filter(Boolean),
        children: matchingTocItems[0]?.children?.items?.map(child => ({
          title: child.title,
          href: child.href
        })) || []
      };

      timelineItems[item.href] = timelineItem;
    }
  
    // Then add position and progression information from positionsList
    for (const item of readingOrder) {
      const timelineItem = timelineItems[item.href];
      if (!timelineItem) continue;

      const positions = positionsList
        .filter(p => p.href === item.href)
        .sort((a, b) => (a.locations.position || 0) - (b.locations.position || 0));
  
      if (positions.length > 0) {
        const start = positions[0].locations;
        const end = positions.length > 1 
          ? positions[positions.length - 1].locations 
          : undefined;
  
        timelineItem.positionRange = start.position !== undefined 
          ? [start.position, end?.position] 
          : undefined;
  
        timelineItem.progressionRange = start.progression !== undefined 
          ? [start.progression, end?.progression] 
          : undefined;
  
        timelineItem.totalProgressionRange = start.totalProgression !== undefined 
          ? [start.totalProgression, end?.totalProgression] 
          : undefined;
      }
    }

    return timelineItems;
  }, [publication?.readingOrder?.items, publication?.toc?.items, positionsList]);

  const updateTimelineItems = useCallback(() => {
    if (!currentLocation || !timelineItems) {
      setPreviousItem(null);
      setNextItem(null);
      setCurrentItem(null);
      return;
    }

    const currentItem = timelineItems[currentLocation.href];
    if (!currentItem) {
      setPreviousItem(null);
      setNextItem(null);
      setCurrentItem(null);
      return;
    }

    setCurrentItem(currentItem);

    const timelineItemsArray = Object.values(timelineItems);
    const currentIndex = timelineItemsArray.findIndex(item => item.href === currentLocation.href);

    if (currentIndex === -1) {
      setPreviousItem(null);
      setNextItem(null);
    } else {
      setPreviousItem(currentIndex > 0 ? timelineItemsArray[currentIndex - 1] : null);
      setNextItem(currentIndex < timelineItemsArray.length - 1 ? timelineItemsArray[currentIndex + 1] : null);
    }
  }, [currentLocation, timelineItems]);

  useEffect(() => {
    if (!publication) return;
    
    const idGenerator = () => `toc-${ ++idCounterRef.current }`;
    setTocTree(buildTocTree(publication.toc?.items || [], idGenerator, positionsList));
    setTimelineItems(buildTimelineItems());
  }, [publication, positionsList, buildTocTree, buildTimelineItems]);

  useEffect(() => {
    if (!tocTree.length || !timelineItems) return;

    // If we have a current location, use it
    if (currentLocation) {
      handleTocEntryOnNav(currentLocation);
    }
    // Otherwise, use the first TOC entry
    else if (tocTree.length > 0) {
      handleTocEntryOnNav(new Locator({ href: tocTree[0].href, type: "" }));
    }

    updateTimelineItems();
  }, [currentLocation, tocTree, timelineItems, handleTocEntryOnNav, updateTimelineItems]);

  // Update the singleton and call onChange
  useEffect(() => {
    timelineInstance = timeline;
    if (onChange) {
      onChange(timeline);
    }
  }, [timeline, onChange]);

  return timeline;
};