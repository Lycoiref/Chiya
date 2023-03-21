import { Context, Schema } from 'koishi'
import { h } from 'koishi'
import path from "path";

//图片转文字的包
//https://yarnpkg.com/package/ultimate-text-to-image
import { UltimateTextToImage} from "ultimate-text-to-image"


export const name = 'help1'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  const textToImage = new UltimateTextToImage("Ultimate Text To Image", {
    width: 400,
    maxWidth: 1000,
    maxHeight: 1000,
    fontFamily: "Arial",
    fontColor: "#00FF00",
    fontSize: 72,
    minFontSize: 10,
    lineHeight: 50,
    autoWrapLineHeightMultiplier: 1.2,
    margin: 20,
    marginBottom: 40,
    align: "center",
    valign: "middle",
    borderColor: 0xFF000099,
    borderSize: 2,
    backgroundColor: "0080FF33",
    underlineColor: "#00FFFF33",
    underlineSize: 2,
  })
  textToImage.render().toFile(path.join(__dirname, "image2.png"))
  ctx.command('help1', '帮助1')
    .action(({ session }) => {
      session.send(h('image', { url: __dirname +'image2.png' }))
    })
}
