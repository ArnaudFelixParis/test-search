// search-utils.spec.ts

import { slidingHammingDistance, suggestTerms } from './search.util';

describe('search-utils', () => {
  describe('slidingHammingDistance', () => {
    it('retourne 0 pour un match exact en sous-chaîne', () => {
      expect(slidingHammingDistance('gros', 'xxgrosyy')).toBe(0);
      expect(slidingHammingDistance('gros', 'gros')).toBe(0);
    });

    it('retourne la distance minimale par remplacements sur une fenêtre glissante', () => {
      // "graisse": fenêtres de 4 => "grai","rais","aiss","isse"
      // meilleure fenêtre vs "gros" => 2 remplacements
      expect(slidingHammingDistance('gros', 'graisse')).toBe(2);

      // "agressif": fenêtres de 4 => "agre","gres","ress","essi","ssif"
      // meilleure fenêtre vs "gros" => 1 remplacement ("gres" vs "gros")
      expect(slidingHammingDistance('gros', 'agressif')).toBe(1);
    });

    it('retourne null si le candidat est trop court', () => {
      expect(slidingHammingDistance('gros', 'gro')).toBeNull();
      expect(slidingHammingDistance('abcd', 'abc')).toBeNull();
    });

    it('gère les cas limites (query vide)', () => {
      expect(slidingHammingDistance('', 'whatever')).toBe(0);
    });

    it('early-exit: ne dépasse pas le meilleur (test de stabilité, pas de perf)', () => {
      // On ne peut pas tester l’early-exit directement, mais on vérifie le résultat
      expect(slidingHammingDistance('aaaaa', 'zzzzaaaaa')).toBe(0); // contient "aaaaa"
    });
  });

  describe('suggestTerms', () => {
    const list = ['gros', 'gras', 'graisse', 'agressif', 'go', 'ros', 'gro'];

    it('respecte l’exemple: top 2 pour "gros"', () => {
      expect(suggestTerms('gros', list, 2)).toEqual([
        { term: 'gros', diff: 0, lenDelta: 0 },
        { term: 'gras', diff: 1, lenDelta: 0 },
      ]);
    });

    it('ignore les termes trop courts', () => {
      expect(suggestTerms('abcd', ['abc', 'ab', 'a'], 5)).toEqual([]);
    });

    it('applique le tri: diff ↑, écart de longueur ↑, alpha ↑', () => {
      const terms = ['abcz', 'abca', 'zzzabca'];
      // query = abcd
      // abca -> diff=1, lenDelta=0
      // abcz -> diff=1, lenDelta=0
      // zzzabca -> diff min=1, lenDelta=3
      expect(suggestTerms('abcd', terms, 3)).toEqual([
        { term: 'abca', diff: 1, lenDelta: 0 },
        { term: 'abcz', diff: 1, lenDelta: 0 },
        { term: 'zzzabca', diff: 1, lenDelta: 3 },
      ]);
    });

    it('retourne au plus N éléments', () => {
      const res = suggestTerms('gros', list, 1);
      expect(res.length).toBe(1);
      expect(res[0]).toEqual({ term: 'gros', diff: 0, lenDelta: 0 });
    });

    // it('retourne [] si la liste est vide ou si query vide (après normalisation côté appelant)', () => {
    //   expect(suggestTerms('abc', [], 5)).toEqual([]);
    //   // Si tu veux que query vide => pas de suggestions :
    //   expect(suggestTerms('', ['abc', 'def'], 5)).toEqual(['abc', 'def'].slice(0, 5)); // adapte selon ta politique
    // });
  });
});
