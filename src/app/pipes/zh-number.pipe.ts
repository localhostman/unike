import { Pipe, PipeTransform } from '@angular/core';

interface Ip {
  text: string;
  value: number;
}

const P: Array<Ip> = [
  { text: "千", value: 1000 },
  { text: "百", value: 100 },
  { text: "十", value: 10 },
  { text: "", value: 1 }
];

const NUM: Array<string> = [
  "零", "一", "二", "三", "四", "五",
  "六", "七", "八", "九"

];

const UM: string = "个";

@Pipe({
  name: 'zhNumber'
})
export class ZhNumberPipe implements PipeTransform {
  transform(value: number, ...args: any[]): any {
    return ZhNumberPipe.sectionToZh(value);
  }

  private static sectionToZh(value: number) {
    if (!value)
      return "零" + UM;

    let part2 = value % 10000;
    let part1 = (value - part2) / 10000;

    return ZhNumberPipe.toZh(part1, "万", false) + " " + ZhNumberPipe.toZh(part2, "", part1 > 0) + " " + UM;
  }

  private static toZh(v: number, um: string, prefix: boolean) {
    if (!v)
      return "";

    let o: string = "";//输出
    let ct: number = 0;//计数器
    let cp: Ip; //当前P
    let r: number = 0; //余数
    let cv: number; // 当前零时值
    let u: number; //位数值
    let z: boolean=false; //是否已补零

    do {
      cp = P[ct];
      cv = cp.value;

      r = v % cv;

      if (v < cv) {
        if ((!!o || prefix) && !z) {
          o += "零";
          z=true;
        }
      }
      else {
        z=false;
        u = (v - r) / cv;
        o += (cv==10 && u==1 ? "" : NUM[u]) + cp.text;
      }

      v = r;
      ct++;

    } while (!!v);

    return o + um;
  }

}
