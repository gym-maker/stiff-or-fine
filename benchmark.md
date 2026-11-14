# Benchmark: simple, hugely played games → what to steal for "Stiff or Fine?" (2026-11-14 KST)

Why: hound K played v1 (a two-button text quiz) and said "재미가 없네". Before redesigning, I looked at what makes simple games stick.
Sources: designer interviews and analyses (links at the bottom).

| # | Game | Core verb | Why it's fun (feedback / risk / escalation / mastery) | Session + share loop |
|---|---|---|---|---|
| 1 | **Fruit Ninja** (Halfbrick, 2010) | Swipe to slice | Every slice gets layered "juice": a trail where your finger went, the fruit splits along your exact cut, halves fly apart, splatter, screen flash, swish-squish sounds. **Bombs are the twist: things you must NOT slice.** 3 missed fruits = 3 strikes. Slicing 3 in one swipe is a combo, a risk-reward reason to wait. | 60–90 s rounds, instant restart, best score. Easy to understand by watching ("YouTubeable"). |
| 2 | **Papers, Please** (Lucas Pope) | Inspect → stamp approve/deny | Inspection under time pressure. Spot the wrong detail fast. Tactile stamp punch. Rules escalate daily, and penalties (money, family) make every call matter. Speed vs accuracy is the core tension. | Day-by-day structure, "one more day". Players share their stories and endings. |
| 3 | **Reigns** (Nerial) | Swipe left/right on a card | Funny gap between a trivial swipe and big consequences. Short, punchy writing. Characters react (they blink faster when stressed), and death comes fast and funny. Cards are physical: "it's natural to move the card", so no tutorial. | Die quickly, start again as the next heir. 100 decisions in 5 minutes. |
| 4 | **Wordle** | Guess a word (once a day) | Low stakes, a feeling of being clever, everyone gets the same puzzle. | **Spoiler-free emoji grid** = a tiny story of your run that friends read at a glance. A daily shared puzzle = water-cooler talk. Players invented the emoji sharing, and the dev automated it. |
| 5 | **Suika (Watermelon) Game** | Drop and merge | Clear core conflict: order vs chaos. You always know whether you're winning. Physics adds small surprises. Short tries, "next time I'll do better". | Viral through streamers. Watching others fail triggers "I can do better than that". |
| 6 | **Stack** (Ketchapp, hyper-casual) | One tap on time | One mechanic, no tutorial, learn by failing. Every miss has a clear cause and shrinks your margin, so pressure builds itself. | Tap anywhere to restart instantly. Share the score. |
| 7 | **Tetris** | Rotate/sort falling pieces | Each falling piece is a problem and a solution. Speed rises and keeps you in flow. Constant small wins (line clears). | Endless, gets faster, chase a high score. |
| 8 | **Vampire Survivors** | Move (attacks are automatic) | Weak-to-overpowered arc. Enemy density and timed pressure rise all the time. Constant XP/level-up sounds and visuals. Near misses → another run. | 15–30 min runs, unlocks persist. |
| 9 | **메트로 타이핑 Metro Typing** (Korean viral web game, 2026) | Type station names → the train moves | Familiar everyday material (your subway line) plus instant visible progress for every keystroke. "I ride it every day, so why can't I remember?" Rankings. | Web link, no install, no sign-up. The play screen itself is the shareable video. 10M views and 40k sign-ups. |
| 10 | **Korean share tests (MBTI-style, 오징어 테스트, '80억 분의 1')** | Answer → get a result type | Personal identity result, funny title. | The result card is made to share and compare with friends. |

## Patterns that matter for us
1. **A physical verb with heavy juice beats buttons** (Fruit Ninja, Reigns). Slicing with a trail, things splitting, flash, shake and sound.
2. **A "don't touch" object creates real risk** (Fruit Ninja bombs). For us, *fine* emails are the bombs. Shredding a polite email is a strike.
3. **Pressure from the sky** (Tetris, Stack). Items fall faster and faster, so you're tense within 10 seconds.
4. **A reacting character with consequences** (Reigns, Papers Please). A boss whose face goes calm → annoyed → furious → explodes. Short funny lines.
5. **Short rounds + instant retry** (Stack, Suika). Game over → play again in 1 tap.
6. **A daily shared seed + a spoiler-free grid + an identity title** (Wordle, Korean result tests). This was already in v1; keep it.
7. **Familiar everyday material** (Metro Typing). Office email pain is something everyone knows ("as per my last email" 😬).
8. **Learning shouldn't interrupt flow** (Papers Please teaches through consequences). Show the better phrasing only on the game-over screen.

## Decision → "Inbox Defense / 받은편지함 지키기"
Mainly **Fruit Ninja** (swipe to slash, juice, 3 strikes, fine emails = bombs, multi-slash combo), with **Tetris/Stack pressure** (falling cards, speed and spawn rate ramp up), a **Reigns/Papers Please boss** (mood face and one-liners, explodes on the 3rd strike), and the **Wordle loop** (daily seed, emoji grid, result title card).
- Slash stiff emails before they land in the inbox. Let fine ones land (+ding). Slashing a fine one = strike. A stiff one landing = strike.
- Power-ups: ☕ coffee = slow motion, 🏝️ Out of Office = clears the screen.
- The workday clock runs 9 AM → 6 PM (90 s). Surviving to 6 PM gives a bonus. Most runs end when the boss explodes, around 40–80 s.

### Sources
- Fruit Ninja designer notes: https://ramine.net/writing/fruit-ninja-design ; Buttonless (Rigney) chapter on Fruit Ninja
- Papers, Please: https://www.gamedeveloper.com/design/designing-the-bleak-genius-of-i-papers-please-i- ; https://mechanicsofmagic.com/2021/06/05/design-details-in-papers-please/
- Reigns: https://www.polygon.com/2016/9/15/12927968/reigns-mobile-pc-ios-royalty-tinder/ ; https://www.pcgamer.com/how-reigns-and-its-forthcoming-sequel-make-their-tinderocracy-work/
- Wordle: https://www.newyorker.com/culture/infinite-scroll/why-you-cant-resist-wordle ; https://www.businessinsider.com/wordle-game-viral-experts-psychology-sharing-twitter-2022-1
- Suika: https://jboger.substack.com/p/lessons-from-a-smart-watermelon ; https://realsound.jp/tech/2023/09/post-1447261_2.html
- Stack / hyper-casual: https://www.gamedeveloper.com/design/admiring-the-game-design-in-hyper-casual-games
- Vampire Survivors / Tetris: https://www.kokutech.com/blog/gamedev/design-patterns/power-fantasy/vampire-survivors ; https://www.bbc.com/future/article/20121022-the-psychology-of-tetris
- 메트로 타이핑: https://pulmap.app/blog/reel-metro-typing/
