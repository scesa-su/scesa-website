const PICTOGRAPH = String.raw`(?![©®™])\p{Extended_Pictographic}`;
const SKIN_TONES = String.raw`[\u{1F3FB}-\u{1F3FF}]*`;
const EMOJI = new RegExp(
  String.raw`(?:\p{Regional_Indicator}{2}|${PICTOGRAPH}${SKIN_TONES}(?:‍${PICTOGRAPH}${SKIN_TONES})*)[ \t]*`,
  "gu",
);
const INVISIBLE = /[​‍️⃣]/g;

export function stripEmoji(value: string) {
  return value.replace(EMOJI, "").replace(INVISIBLE, "");
}
