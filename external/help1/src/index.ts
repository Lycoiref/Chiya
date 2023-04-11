import { Context, Schema } from 'koishi'
import { h } from 'koishi'
//图片转文字的包
//https://yarnpkg.com/package/ultimate-text-to-image
// import { UltimateTextToImage} from "ultimate-text-to-image"


export const name = 'help1'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  // ctx.command('help1', '帮助1')
  //   .action(async ({ session }) => {
  //     let helpString = "1.吃饭" + "\n" + "2.睡觉"+ "\n"  + "3.打豆豆"
  //     const textToImage = new UltimateTextToImage(helpString, {
  //       width: 400,
  //       maxWidth: 1000,
  //       maxHeight: 1000,
  //       fontFamily: "宋体",
  //       fontColor: "#FFFFFF",
  //       fontSize: 23,
  //       minFontSize: 10,
  //       lineHeight: 50,
  //       // autoWrapLineHeightMultiplier: 1.2,
  //       margin: 20,
  //       marginBottom: 40,
  //       align: "center",
  //       valign: "middle",
  //       borderColor: 0xFF000099,
  //       borderSize: 2,
  //       backgroundColor: "#000000",
  //     })
  //     let buffer = textToImage.render().toBuffer("image/jpeg")
  //     await session.send(h.image(buffer, 'image/png'))
  //   })
}
