# Video 1 — Concepts & Explanation (word-for-word script)

> Read this aloud on camera. Target: ~5–8 minutes. Voice: warm, plain, confident — the way I actually
> talk. Bracketed lines like **[screen: …]** are stage directions, not read aloud.
>
> ⚠️ Line numbers below are a snapshot. If I touch the code before recording, re-verify them.

---

## Opening

Hi, I'm Raina DeJute. This is my Module 16 capstone — my personal portfolio, built in React and Vite,
with Supabase as the whole backend, deployed to GitHub Pages. It's live at rdejute dot github dot io.

I could walk you through a dozen small things, but instead I want to go deep on the three parts that
were genuinely hard — the ones I had to sit with until I actually understood them, not just until they
worked. For each one I'll tell you what it is, why it was tricky, and how I solved it, and I'll show
you the exact lines.

---

## Concept 1 — Routing without a router: keeping the URL clean, but the secret doors reachable

[screen: the live site; click through Home, Portfolio, Links, Contact — point at the address bar
staying put]

So the first one is navigation. The checklist has a requirement that looks small and turns out to be
sneaky: the public URL has to stay at the root. No slash-home, no slash-portfolio. But *another*
requirement says the secret admin routes have to be reachable by typing a URL. Those two things fight
each other.

The way I solved it: I don't use a routing library at all. My four public pages switch by React
**state**. Let me show you. [screen: open `src/App.jsx`] In `App.jsx`, there's a plain object at line
19 called `PAGES` that maps a name like "home" or "contact" to a component. The current view is just a
piece of state, and when you click a nav item I call `navigate` — that's line 37 — which sets the
state. Because it's state and not a URL change, the address bar never moves. That satisfies the
"URL stays at root" rule.

Now the secret routes. Those two — Login and Back Office — I *do* put in the URL, but in the **hash**,
the part after the pound sign. At line 28 I've got a little lookup table, `VIEW_BY_HASH`, that says
"#login" means the login view and "#backoffice" means the back office. On a static host like GitHub
Pages you can't make up real paths, but the hash is fair game — the browser never asks the server for
it — so hash routes stay typeable and shareable.

Here's the part that was actually hard. I now have **two** sources of truth: my React state, and the
URL hash. They have to agree, in both directions, without spinning in a loop. If I only pushed state
into the URL, then typing a hash or hitting the back button wouldn't do anything. So at line 49 I
listen for the browser's `hashchange` event and pull the hash back into state. And in `navigate`, when
I go to a public page, I actually *clear* the hash with `replaceState` — line 43 — so we always land
back at the clean root URL.

[screen: on any page, press ↑ ↑ ↓ ↓ ← → ← → B A — the login screen appears]

And then the fun one — the Konami Code. From anywhere on the site, if you press up up down down left
right left right B A, the login screen opens. That lives in its own hook, `useKonamiCode.js`. The
sequence is a single array at line 4 so it's easy to change. The listener's at line 26. Two details I
had to get right: at line 29 it ignores keystrokes while you're typing in a form — otherwise typing
"a" in the message box could trip it — and at line 40 it resets if you press a wrong key, but it's
smart enough to let that wrong key *start* a fresh sequence. There's even a little console message at
line 51 hinting the easter egg exists, so an evaluator poking in dev tools can find it.

The last piece is the guard. The Back Office can't just render for anyone who types the hash. At line
72 of `App.jsx`, if the view is "backoffice" and there's no session, I send them to login instead —
and while I'm still checking whether a session exists, I show a neutral loading view so it doesn't
flash the login screen for a split second.

**What I learned:** routing is really just "given some input — a click, a hash, a keystroke — what
should be on screen?" Once I stopped thinking I needed a library and started thinking about state and
keeping it in sync with the URL, the whole thing got simple and honest.

---

## Concept 2 — Security with no server: Row-Level Security is the real lock

[screen: the Contact page]

Second concept, and this is the one that changed how I think. My site has no backend server. The
browser talks directly to Supabase — that's Postgres — using a public key that ships in my JavaScript.
Anyone can open dev tools and read that key. When I first understood that, my gut said "that can't be
safe." And the answer is: it's safe, but the safety isn't in the client at all. It's in the database.

[screen: open `supabase/schema.sql`]

This is `schema.sql`. At line 13 I turn on Row-Level Security on the messages table. Then there are
three policies. Line 16: the public — the "anon" role — may **insert** a message, and that's it. Line
22: only an **authenticated** user may **select**, that is, read messages. Line 28: only an
authenticated user may **delete**. So the contact form can write into my inbox, but it can *never* read
it back. That public key literally cannot pull the messages out, because Postgres refuses.

That's the mental shift I want to name out loud: the login screen I showed you a minute ago, the guard
that hides the Back Office — that's just **user experience**. It's a closed door, not a locked one. The
*lock* is these RLS policies. If I'd written them wrong, someone could hide the page all day and still
read every message. Getting `to anon` versus `to authenticated` right is the actual security work.

[screen: open `src/context/AuthContext.jsx`]

On the client side, I track who's logged in in one place — `AuthContext.jsx`. This was tricky because
auth is asynchronous and it can change on its own. At line 16 I ask Supabase, "is there already a
session?" — that's a promise, so I wait for it. At line 22 I subscribe to `onAuthStateChange`, so if
the token refreshes or I log out in another tab, my app hears about it. `signIn` at line 32 wraps
Supabase's `signInWithPassword`, and `signOut` at line 39 clears everything.

[screen: log in, land on Back Office, then hit browser refresh — still logged in]

And session persistence just works because Supabase stores the session for me; on load I read it back
with `getSession`, so refreshing doesn't kick me out — it drops me right back into the Back Office.

**What I learned:** "serverless" doesn't mean "no security" — it means the security moves into the
database, and you'd better understand it, because it's the only thing standing between the public and
your data. That reframed the whole project for me.

---

## Concept 3 — One attribute re-skins the whole site, and the switch is animated

[screen: the site in dark mode — the default]

Third one is the theme system, and it has two layers — one architectural, one that's just a fun,
genuinely tricky piece of browser API.

The architecture: every single color in this app is a **CSS variable** — I call them tokens — defined
in `tokens.css`. [screen: open `src/styles/tokens.css`] At line 5 there's the light theme under
`:root`, and at line 56 the exact same variable names again under `data-theme dark`. My components
never write a hex code; they say things like `var(--bg)`. So when I flip one attribute — `data-theme`
on the html element — every color on the site changes at once. That's it. That flip happens at line 15
of `ThemeContext.jsx`.

[screen: click the theme toggle — the light palette wipes across the screen in a circle from the
button; toggle again and the espresso wipes back]

Now the part I'm proud of. I didn't want the theme to just snap. I wanted the new palette to wash
across the screen from the button I clicked. That uses the browser's **View Transitions API**, and it
fought me. Here's why. [screen: `src/context/ThemeContext.jsx`, around line 36] You call
`document.startViewTransition`, and you hand it a function that changes the page. The browser takes a
snapshot *before* your function runs and *after*, and animates between them. The problem: React
updates state asynchronously. So when the browser went to take its "after" picture, React hadn't
actually changed anything yet — and the animation did nothing.

The fix is line 36 to 38: I wrap my theme change in **`flushSync`**. That forces React to apply the
update *synchronously*, right there inside the callback, so by the time the browser snapshots "after,"
the new theme is really on the page. Then at line 40 I animate the new snapshot's `clip-path` — a
circle growing from the exact x-y coordinates of my click out to the far corner of the screen. That's
the wipe.

And it's polite: at line 23, if the browser doesn't support the API, or if you've told your system you
prefer reduced motion, it skips all of that and just swaps instantly.

**What I learned:** two things. Centralizing your design into tokens means you can restyle an entire
site by editing one file — I actually reworked this whole palette late in the project and it was
painless because of this. And on the animation: I learned to reason about *when* the DOM actually
changes versus when I asked it to. `flushSync` is a small word for a real idea — sometimes you need to
tell React "do it now, not later."

---

## Closing

So those are the three I'd defend hardest: routing by state with hash-based secret doors, security that
lives in the database instead of a server, and a theme system where one attribute repaints everything —
animated with a browser API I had to really wrestle with.

The thread through all three is the same: I didn't want to just paste code that ran. I wanted to
understand *why* it works, because that's the difference between using a tool and actually knowing it.
Thanks for watching.
