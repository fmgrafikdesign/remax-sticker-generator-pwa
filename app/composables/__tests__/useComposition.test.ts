import { describe, expect, it } from 'vitest'
import { createComposition, stickerFilename } from '../useComposition'

const photo = (name = 'house.jpeg') => new File(['x'], name, { type: 'image/jpeg' })

describe('createComposition', () => {
  it('refuses stickers until a photo is chosen', () => {
    const c = createComposition()
    expect(c.addSticker('a.png')).toBe(false)
    expect(c.stickers.value).toEqual([])
    expect(c.selectedId.value).toBeNull()
  })

  it('selects each newly added sticker and gives it a unique id', () => {
    const c = createComposition()
    c.setImage(photo())
    c.addSticker('a.png')
    c.addSticker('b.png')
    const [first, second] = c.stickers.value
    expect(first!.id).not.toBe(second!.id)
    expect(c.selectedId.value).toBe(second!.id)
  })

  it('deletes only the selected sticker and clears the selection', () => {
    const c = createComposition()
    c.setImage(photo())
    c.addSticker('a.png')
    c.addSticker('b.png')
    c.selectSticker(c.stickers.value[0]!.id)
    c.deleteSelectedSticker()
    expect(c.stickers.value.map(s => s.url)).toEqual(['b.png'])
    expect(c.selectedId.value).toBeNull()
  })

  it('does nothing on delete when no sticker is selected', () => {
    const c = createComposition()
    c.setImage(photo())
    c.addSticker('a.png')
    c.selectedId.value = null
    c.deleteSelectedSticker()
    expect(c.stickers.value).toHaveLength(1)
  })

  it('drops stickers and selection when the photo is replaced', () => {
    const c = createComposition()
    c.setImage(photo('one.jpg'))
    c.addSticker('a.png')
    c.setImage(photo('two.jpg'))
    expect(c.stickers.value).toEqual([])
    expect(c.selectedId.value).toBeNull()
    expect(c.filename.value).toBe('two.jpg')
    expect(c.hasImage.value).toBe(true)
  })
})

describe('stickerFilename', () => {
  it.each([
    ['house.jpeg', 'house-stickers.jpg'],
    ['my.holiday.photo.png', 'my.holiday.photo-stickers.jpg'],
    ['noextension', 'noextension-stickers.jpg']
  ])('%s -> %s', (input, expected) => {
    expect(stickerFilename(input)).toBe(expected)
  })
})
