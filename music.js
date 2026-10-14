/* =========================================================
   🎧 JS RNG 2.0 뮤직 플레이어
   - 기본 곡은 BGM_TRACKS 에 추가하면 됨 (mp3 파일을 레포에 넣고 한 줄 추가)
   - '내 음악 추가'로 폰에 있는 곡을 넣으면 IndexedDB 에 저장돼서 다음에도 남음
   ========================================================= */

export const BGM_TRACKS = [
    { id: 'main', title: 'Abyss Drift', artist: 'JS RNG OST', src: 'main_bgm.mp3' },
    { id: 'lobby', title: 'Lobby Signal', artist: 'JS RNG OST', src: 'lobby_bgm.mp3' }
];

const STATE_KEY = 'js_rng_music';
const DB_NAME = 'js_rng_music_db';
const STORE = 'tracks';

/* ---------- IndexedDB (내 음악) ---------- */
function openDb() {
    return new Promise((res, rej) => {
        if (!('indexedDB' in window)) return rej(new Error('no idb'));
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: 'id' });
        req.onsuccess = () => res(req.result);
        req.onerror = () => rej(req.error);
    });
}
async function dbAll() {
    try {
        const db = await openDb();
        return await new Promise((res, rej) => {
            const r = db.transaction(STORE).objectStore(STORE).getAll();
            r.onsuccess = () => res(r.result || []);
            r.onerror = () => rej(r.error);
        });
    } catch (e) { return []; }
}
async function dbPut(rec) {
    const db = await openDb();
    return new Promise((res, rej) => {
        const tx = db.transaction(STORE, 'readwrite');
        tx.objectStore(STORE).put(rec);
        tx.oncomplete = res; tx.onerror = () => rej(tx.error);
    });
}
async function dbDel(id) {
    const db = await openDb();
    return new Promise((res, rej) => {
        const tx = db.transaction(STORE, 'readwrite');
        tx.objectStore(STORE).delete(id);
        tx.oncomplete = res; tx.onerror = () => rej(tx.error);
    });
}

/* ---------- 네모 픽셀 커버아트 (곡마다 고유) ---------- */
const coverCache = new Map();
function hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
}
export function coverArt(track) {
    if (coverCache.has(track.id)) return coverCache.get(track.id);
    let seed = hash(track.id + track.title);
    const rnd = () => { seed = Math.imul(seed ^ (seed >>> 15), 2246822507) >>> 0; seed ^= seed >>> 13; return (seed % 10000) / 10000; };
    const hue = Math.floor(rnd() * 360), hue2 = (hue + 40 + rnd() * 140) % 360;
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d');
    const bg = g.createLinearGradient(0, 0, 128, 128);
    bg.addColorStop(0, `hsl(${hue},55%,10%)`); bg.addColorStop(1, `hsl(${hue2},60%,16%)`);
    g.fillStyle = bg; g.fillRect(0, 0, 128, 128);
    const n = 8, s = 128 / n;
    for (let y = 0; y < n; y++) for (let x = 0; x < n / 2; x++) {
        if (rnd() < 0.45) {
            const l = 35 + rnd() * 35, h = rnd() < 0.5 ? hue : hue2;
            g.fillStyle = `hsla(${h},85%,${l}%,${0.35 + rnd() * 0.6})`;
            g.fillRect(x * s + 1, y * s + 1, s - 2, s - 2);
            g.fillRect((n - 1 - x) * s + 1, y * s + 1, s - 2, s - 2); // 좌우 대칭
        }
    }
    g.strokeStyle = `hsla(${hue2},90%,75%,0.8)`; g.lineWidth = 3;
    g.strokeRect(36, 36, 56, 56);
    const url = c.toDataURL('image/png');
    coverCache.set(track.id, url);
    return url;
}

/* ---------- 플레이어 ---------- */
export function createMusicPlayer({ getVolume, isEnabled }) {
    const el = new Audio();
    el.preload = 'auto';
    const listeners = new Set();
    const emit = () => listeners.forEach(fn => fn());

    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(STATE_KEY) || '{}'); } catch (e) {}

    const st = {
        tracks: BGM_TRACKS.map(t => ({ ...t, builtin: true })),
        currentId: saved.currentId || 'main',
        shuffle: !!saved.shuffle,
        repeat: saved.repeat || 'all',      // 'all' | 'one' | 'off'
        context: null,                      // 'lobby' | 'main'
        userPaused: false,
        ducked: false
    };
    const persist = () => {
        try { localStorage.setItem(STATE_KEY, JSON.stringify({ currentId: st.currentId, shuffle: st.shuffle, repeat: st.repeat })); } catch (e) {}
    };

    const cur = () => st.tracks.find(t => t.id === st.currentId) || st.tracks[0];
    const volume = () => { el.volume = isEnabled() ? Math.max(0, Math.min(1, getVolume())) : 0; };

    function load(track, autoplay) {
        st.currentId = track.id;
        if (el.dataset.id !== track.id) {
            el.dataset.id = track.id;
            el.src = track.src;
        }
        volume();
        if (autoplay && isEnabled() && !st.ducked) { st.userPaused = false; el.play().catch(() => {}); }
        if (st.context === 'main') persist();
        updateMediaSession();
        emit();
    }

    function order() {
        // 로비에서도 큐는 전체 곡
        return st.tracks;
    }
    function step(dir, fromEnded) {
        const list = order();
        if (!list.length) return;
        if (fromEnded && st.repeat === 'one') { el.currentTime = 0; el.play().catch(() => {}); return; }
        let i = list.findIndex(t => t.id === st.currentId);
        if (st.shuffle && list.length > 1) {
            let j;
            do { j = Math.floor(Math.random() * list.length); } while (j === i);
            i = j;
        } else {
            i += dir;
            if (i >= list.length) { if (fromEnded && st.repeat === 'off') { el.pause(); emit(); return; } i = 0; }
            if (i < 0) i = list.length - 1;
        }
        load(list[i], true);
    }

    el.addEventListener('ended', () => step(1, true));
    ['play', 'pause', 'loadedmetadata'].forEach(ev => el.addEventListener(ev, emit));
    el.addEventListener('timeupdate', () => listeners.forEach(fn => fn('time')));

    function updateMediaSession() {
        if (!('mediaSession' in navigator)) return;
        const t = cur();
        try {
            navigator.mediaSession.metadata = new MediaMetadata({ title: t.title, artist: t.artist, album: 'JS RNG 2.0', artwork: [{ src: coverArt(t), sizes: '128x128', type: 'image/png' }] });
            navigator.mediaSession.setActionHandler('play', () => api.toggle(true));
            navigator.mediaSession.setActionHandler('pause', () => api.toggle(false));
            navigator.mediaSession.setActionHandler('nexttrack', () => api.next());
            navigator.mediaSession.setActionHandler('previoustrack', () => api.prev());
        } catch (e) {}
    }

    const api = {
        el,
        get state() { return st; },
        get current() { return cur(); },
        get playing() { return !el.paused; },
        on(fn) { listeners.add(fn); return () => listeners.delete(fn); },

        // 로비/메인 전환
        start(context) {
            st.context = context;
            st.userPaused = false;
            if (context === 'lobby') load(st.tracks.find(t => t.id === 'lobby') || cur(), true);
            else {
                let saved2 = {};
                try { saved2 = JSON.parse(localStorage.getItem(STATE_KEY) || '{}'); } catch (e) {}
                const want = st.tracks.find(t => t.id === (saved2.currentId || 'main')) || st.tracks[0];
                load(want, true);
            }
        },
        stop() { el.pause(); emit(); },
        // 컷씬 동안 잠깐 꺼두기
        duck() { st.ducked = true; el.pause(); },
        unduck() {
            st.ducked = false;
            volume();
            if (!st.userPaused && isEnabled() && el.src) el.play().catch(() => {});
        },
        unlock() { if (!st.userPaused && !st.ducked && isEnabled() && el.src && el.paused) el.play().catch(() => {}); },
        updateVolume: volume,

        play(id) {
            const t = st.tracks.find(x => x.id === id);
            if (!t) return;
            if (t.id === st.currentId && el.src) { api.toggle(true); return; }
            load(t, true);
        },
        toggle(force) {
            const want = force ?? el.paused;
            if (want) {
                st.userPaused = false;
                if (!el.src) load(cur(), true);
                else if (isEnabled()) el.play().catch(() => {});
            } else { st.userPaused = true; el.pause(); }
            emit();
        },
        next() { step(1, false); },
        prev() {
            if (el.currentTime > 3) { el.currentTime = 0; return; }
            if (st.shuffle) { step(1, false); return; }
            step(-1, false);
        },
        seek(frac) { if (isFinite(el.duration)) el.currentTime = Math.max(0, Math.min(1, frac)) * el.duration; },
        setShuffle(v) { st.shuffle = v ?? !st.shuffle; persist(); emit(); },
        cycleRepeat() { st.repeat = st.repeat === 'all' ? 'one' : st.repeat === 'one' ? 'off' : 'all'; persist(); emit(); },

        async addFiles(files) {
            let added = 0;
            for (const f of files) {
                if (!f.type.startsWith('audio/') && !/\.(mp3|m4a|aac|ogg|wav|flac)$/i.test(f.name)) continue;
                const id = 'u_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
                const title = f.name.replace(/\.[^.]+$/, '');
                const rec = { id, title, artist: '내 음악', blob: f, added: Date.now() };
                try { await dbPut(rec); } catch (e) { /* 저장 실패해도 이번 세션엔 재생 */ }
                st.tracks.push({ id, title, artist: '내 음악', src: URL.createObjectURL(f), builtin: false });
                added++;
            }
            emit();
            return added;
        },
        async remove(id) {
            const t = st.tracks.find(x => x.id === id);
            if (!t || t.builtin) return;
            const wasCurrent = st.currentId === id;
            if (wasCurrent) step(1, false);
            st.tracks = st.tracks.filter(x => x.id !== id);
            try { URL.revokeObjectURL(t.src); await dbDel(id); } catch (e) {}
            if (st.currentId === id) load(st.tracks[0], !el.paused);
            emit();
        }
    };

    // 저장해둔 내 음악 불러오기
    dbAll().then(recs => {
        recs.sort((a, b) => a.added - b.added).forEach(r => {
            st.tracks.push({ id: r.id, title: r.title, artist: r.artist || '내 음악', src: URL.createObjectURL(r.blob), builtin: false });
        });
        if (recs.length) emit();
    });

    return api;
}
