import { ThPlugin } from "../PluginRegistry";
import { ThActionsKeys, ThSettingsKeys } from "@/preferences/models/enums";

import { StatefulFullscreenTrigger } from "../../Actions/Fullscreen/StatefulFullscreenTrigger";
import { StatefulJumpToPositionTrigger } from "../../Actions/JumpToPosition/StatefulJumpToPositionTrigger";
import { StatefulJumpToPositionContainer } from "../../Actions/JumpToPosition/StatefulJumpToPositionContainer";
import { StatefulSettingsTrigger } from "../../Actions/Settings/StatefulSettingsTrigger";
import { StatefulSettingsContainer } from "../../Actions/Settings/StatefulSettingsContainer";
import { StatefulTocTrigger } from "../../Actions/Toc/StatefulTocTrigger";
import { StatefulTocContainer } from "../../Actions/Toc/StatefulTocContainer";

import { StatefulColumns } from "../../Epub/Settings/StatefulColumns";
import { StatefulFontFamily } from "../../Epub/Settings/Text/StatefulFontFamily";
import { UnstableStatefulFontWeight } from "../../Epub/Settings/Text/StatefulFontWeight";
import { StatefulHyphens } from "../../Epub/Settings/Text/StatefulHyphens";
import { StatefulLayout } from "../../Epub/Settings/StatefulLayout";
import { StatefulLetterSpacing } from "../../Epub/Settings/Spacing/StatefulLetterSpacing";
import { StatefulLineHeight } from "../../Epub/Settings/Spacing/StatefulLineHeight";
import { StatefulParagraphIndent } from "../../Epub/Settings/Spacing/StatefulParagraphIndent";
import { StatefulParagraphSpacing } from "../../Epub/Settings/Spacing/StatefulParagraphSpacing";
import { StatefulPublisherStyles } from "../../Epub/Settings/StatefulPublisherStyles";
import { StatefulSpacingGroup } from "../../Epub/Settings/Spacing/StatefulSpacingGroup";
import { StatefulSpacingPresets } from "@/components/Epub/Settings/Spacing/StatefulSpacingPresets";
import { StatefulTextAlign } from "../../Epub/Settings/Text/StatefulTextAlign";
import { StatefulTextGroup } from "../../Epub/Settings/Text/StatefulTextGroup";
import { StatefulTextNormalize } from "../../Epub/Settings/Text/StatefulTextNormalize";
import { StatefulTheme } from "../../Epub/Settings/StatefulTheme";
import { StatefulWordSpacing } from "../../Epub/Settings/Spacing/StatefulWordSpacing";
import { StatefulZoom } from "../../Settings/StatefulZoom";

export const createDefaultPlugin = (): ThPlugin => {
  return {
    id: "core",
    name: "Core Components",
    description: "Default components for Thorium Web Epub StatefulReader",
    version: "1.0.6",
    components: {
      actions: {
        [ThActionsKeys.fullscreen]: {
          Trigger: StatefulFullscreenTrigger
        },
        [ThActionsKeys.jumpToPosition]: {
          Trigger: StatefulJumpToPositionTrigger,
          Target: StatefulJumpToPositionContainer
        },
        [ThActionsKeys.settings]: {
          Trigger: StatefulSettingsTrigger,
          Target: StatefulSettingsContainer
        },
        [ThActionsKeys.toc]: {
          Trigger: StatefulTocTrigger,
          Target: StatefulTocContainer
        }
      },
      settings: {
        [ThSettingsKeys.columns]: {
          Comp: StatefulColumns
        },
        [ThSettingsKeys.fontFamily]: {
          Comp: StatefulFontFamily,
          type: "text"
        },
        [ThSettingsKeys.fontWeight]: {
          Comp: UnstableStatefulFontWeight,
          type: "text"
        },
        [ThSettingsKeys.hyphens]: {
          Comp: StatefulHyphens,
          type: "text"
        },
        [ThSettingsKeys.layout]: {
          Comp: StatefulLayout
        },
        [ThSettingsKeys.letterSpacing]: {
          Comp: StatefulLetterSpacing,
          type: "spacing"
        },
        [ThSettingsKeys.lineHeight]: {
          Comp: StatefulLineHeight,
          type: "spacing"
        },
        [ThSettingsKeys.paragraphIndent]: {
          Comp: StatefulParagraphIndent,
          type: "spacing"
        },
        [ThSettingsKeys.paragraphSpacing]: {
          Comp: StatefulParagraphSpacing,
          type: "spacing"
        },
        [ThSettingsKeys.publisherStyles]: {
          Comp: StatefulPublisherStyles,
          type: "spacing"
        },
        [ThSettingsKeys.spacingGroup]: {
          Comp: StatefulSpacingGroup,
        },
        [ThSettingsKeys.spacingPresets]: {
          Comp: StatefulSpacingPresets,
          type: "spacing"
        },
        [ThSettingsKeys.textAlign]: {
          Comp: StatefulTextAlign,
          type: "text"
        },
        [ThSettingsKeys.textGroup]: {
          Comp: StatefulTextGroup
        },
        [ThSettingsKeys.textNormalize]: {
          Comp: StatefulTextNormalize,
          type: "text"
        },
        [ThSettingsKeys.theme]: {
          Comp: StatefulTheme
        },
        [ThSettingsKeys.wordSpacing]: {
          Comp: StatefulWordSpacing,
          type: "spacing"
        },
        [ThSettingsKeys.zoom]: {
          Comp: StatefulZoom
        }
      }
    }
  };
};