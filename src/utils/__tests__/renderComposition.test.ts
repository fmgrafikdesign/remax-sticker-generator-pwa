import { describe, expect, it } from 'vitest'
import { fitWithin } from '../renderComposition'

describe('fitWithin', () => {
  it('scales landscape photos so the width hits the cap', () => {
    expect(fitWithin(4000, 3000, 2000)).toEqual({ width: 2000, height: 1500 })
  })

  it('scales portrait photos so the height hits the cap', () => {
    expect(fitWithin(3000, 4000, 2000)).toEqual({ width: 1500, height: 2000 })
  })

  it('never scales up and leaves photos at the cap untouched', () => {
    expect(fitWithin(800, 500, 2000)).toEqual({ width: 800, height: 500 })
    expect(fitWithin(2000, 1000, 2000)).toEqual({ width: 2000, height: 1000 })
  })
})
