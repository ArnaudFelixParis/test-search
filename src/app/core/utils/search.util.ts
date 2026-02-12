export function slidingHammingDistance(query: string, candidate: string): number | null {
  const qLen = query.length;
  const cLen = candidate.length;

  if (qLen === 0) {
    return 0;
  }
  if (cLen < qLen) {
    return null;
  }

  let best = Number.POSITIVE_INFINITY;

  for (let start = 0; start <= cLen - qLen; start++) {
    let diffs = 0;

    for (let i = 0; i < qLen; i++) {
      if (candidate.charCodeAt(start + i) !== query.charCodeAt(i)) {
        diffs++;

        if (diffs >= best) break;
      }
    }

    if (diffs < best) {
      best = diffs;

      if (best === 0) {
        return 0;
      }
    }
  }

  return best;
}

export function suggestTerms(
  query: string,
  terms: string[],
  maxResults: number,
): { term: string; diff: number; lenDelta: number }[] {
  const q = query;
  const qLen = q.length;

  const scored: { term: string; diff: number; lenDelta: number }[] = [];

  for (const term of terms) {
    if (term.length < qLen) {
      continue;
    }

    const d = slidingHammingDistance(q, term);
    if (d === null) {
      continue;
    }

    scored.push({
      term,
      diff: d,
      lenDelta: Math.abs(term.length - qLen),
    });
  }

  scored.sort((a, b) => {
    if (a.diff !== b.diff) return a.diff - b.diff;
    if (a.lenDelta !== b.lenDelta) return a.lenDelta - b.lenDelta;

    return a.term.localeCompare(b.term);
  });

  return scored.slice(0, Math.max(0, maxResults));
}
