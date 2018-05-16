/**
 * 计算管理
 */
class CalculateMgr {
    /**
     * 数字转科学计数
     * @param data  数据
     * @return 基数和系数集合
     */
    public static Transformation(data: number): number[]{
        var numSet: number[] = [];
        var base: number = !!data ? data : 0;
        var power: number = 0;
        if (Math.abs(base) < 0) {
            while (Math.abs(base) < 0) {
                base = base * 10;
                power = power - 1;
            }
        }
        else if (Math.abs(base) > 10) {
            while (Math.abs(base) > 10) {
                base = base / 10;
                power = power + 1;
            }
        }
        numSet.push(base);
        numSet.push(power);
        return numSet;
    }
    
    /**
     * 平衡数字，转为标准科学计数法
     * @param digit  数值
     */
    public static CounterPoise(digit: Digit) {
        digit.CounterPoise();
    }

    /**
     * 比较
     * @param digit0  数值
     * @param digit1  数值
     * @return 对比结果类型
     */
    public static Compare(digit0: Digit, digit1: Digit): number {
        if (digit0 == null || digit1 == null) return Compare.Error;

        if(digit0.Base == 0 && digit1.Base == 0){
            return Compare.Equal;
        }
        else if(digit0.Base >= 0 && digit1.Base <= 0){
            return Compare.Large;
        }
        else if(digit0.Base <= 0 && digit1.Base >= 0){
            return Compare.Little;
        }
        else{
            CalculateMgr.CounterPoise(digit0);
            CalculateMgr.CounterPoise(digit1);
            if (digit0.Power > digit1.Power) {
                return Compare.Large;
            }
            else if(digit0.Power < digit1.Power) {
                return Compare.Little;
            }
            else {
                if (digit0.Base > digit1.Base) {
                    return Compare.Large;
                }
                else if (digit0.Base < digit1.Base) {
                    return Compare.Little;
                }
            }
        }
        return Compare.Equal;
    }

    /**
     * 加法
     * @param digit0  数值
     * @param digit1  数值
     * @return 结果数值
     */
    public static Add(digit0: Digit, digit1: Digit): Digit {
        return digit0.clone.Add(digit1);
    }
    
    /**
     * 减法
     * @param digit0  数值
     * @param digit1  数值
     * @return 结果数值
     */
    public static Sub(digit0: Digit, digit1: Digit): Digit {
        return digit0.clone.Sub(digit1);
    }
    
    /**
     * 乘法
     * @param digit0  数值
     * @param digit1  数值
     * @return 结果数值
     */
    public static Mul(digit0: Digit, digit1: Digit): Digit {
        return digit0.clone.Mul(digit1);
    }
    
    /**
     * 除法
     * @param digit0  数值
     * @param digit1  数值
     * @return 结果数值
     */
    public static Div(digit0: Digit, digit1: Digit): Digit {
        return digit0.clone.Div(digit1);
    }

    /**
     * 根据底数和指数计算幂函数结果，并返回大数值表达式
     */
    public static Pow(b: number, p: number){
        let ret = new Digit([1]);
        while(p > 0){
            let cur = p >= 100 ? 100 : p;
            let tmp = new Digit([Math.pow(b, cur)]);
            ret.Mul(tmp);
            p -= cur;
        }
        return ret;
    }
}

/**
 * 比较枚举
 */
const enum Compare {
    /**
     * 错误
     */
    Error = -2,
    /**
     * 大
     */
    Large = 1,
    /**
     * 等
     */
    Equal = 0,
    /**
     * 小
     */
    Little = -1,
}