import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";
import { Menu } from "@webpack/common";

const fakeVoiceState = {
  enabled: false
};

export default definePlugin({
  name: "FakeDeafen",
  description:
    "Makes you appear muted and deafened to others without affecting your real microphone or audio.",
  authors: [Devs.TheArmagan],

  modifyVoiceState(e) {
    if (window.VencordNative?.plugins?.isPluginEnabled?.("FakeMuteAndDeafen")) {
      return e;
    }

    if (fakeVoiceState.enabled) {
      e.selfMute = true;
      e.selfDeaf = true;
    }

    return e;
  },

  contextMenus: {
    "audio-device-context"(children, data) {
      if (!data?.renderOutputDevices) return;

      if (children.some(c => c?.props?.id === "fake-deafen-toggle")) return;

      const enabled = fakeVoiceState.enabled;

      children.push(
        <Menu.MenuCheckboxItem
          id="fake-deafen-toggle"
          label={`Fake Deafen 𓉘 ${enabled ? "ON" : "OFF"} 𓉝 `}
          checked={enabled}
          action={() => {
            fakeVoiceState.enabled = !enabled;
          }}
        />
      );
    }
  },

  patches: [
    {
      find: "voiceServerPing(){",
      replacement: [
        {
          match: /voiceStateUpdate\((\w+)\){(.{0,10})guildId:/,
          replace:
            "voiceStateUpdate($1){$1=$self.modifyVoiceState($1);$2guildId:"
        }
      ]
    }
  ]
});
