/**
 * 数字
 */
class Digit {
    private static scope: number = 8;

    /**
     * 构造方法
     * @param dataSet   数据集合(只有一个数字是直接转为科学计数，2个数字则第一为基数，第二为指数)
     */
    public constructor(dataSet: number[] = [0]) {
        if (dataSet == null || dataSet.length > 2) {
            console.log("数据错误");
        }
        if (dataSet.length == 1 && dataSet[0] != 0) {
            var data: number[] = CalculateMgr.Transformation(dataSet[0]);
            this.base = data[0];
            this.power = data[1];
        }
        else if (dataSet[0] == 0) {
            this.base = 0;
            this.power = 0;
        }
        else {
            this.base = !!dataSet[0] ? dataSet[0] : 0;
            this.power = !!dataSet[1] ? dataSet[1] : 0;
            this.CounterPoise();
        }
    }

    /**
     * 来自object的数据，创建digit，
     */
    public static fromObject(obj:any):Digit {
        return new Digit([obj.base, obj.power]);
    }
    /**
     * 克隆
     */
    public get clone():Digit {
        return new Digit([this.Base, this.Power]);
    }

    /**
     * 判断本身是否大于等于指定的数
     */
    public Compare(data:any) : Compare {
        if(data instanceof Digit){
            return CalculateMgr.Compare(this, data);
        }
        else{
            let newData = new Digit([data, 0]);
            return CalculateMgr.Compare(this, newData);
        }
    }
    /**
     * 是否比指定数值大
     */
    public Larger(data:any): boolean{
        return this.Compare(data) == Compare.Large; 
    }
    /**
     * 是否比指定数值小
     */
    public Little(data:any): boolean{
        return this.Compare(data) == Compare.Little;
    }
    /**
     * 是否跟指定数值相等
     */
    public Equal(data:any):boolean{
        return this.Compare(data) == Compare.Equal;
    }

    /**
     * 返回自身和data中较大的数
     */
    public max(data:any) : Digit{
        if(data instanceof Digit){
            return data.Compare(this) == Compare.Large ? data : this;
        }
        else{
            let newData = new Digit([data, 0]);
            return newData.Compare(this) == Compare.Large ? newData : this;
        }
    }
    
    /**
     * 调整为标准大数值格式
     */
    public CounterPoise():Digit {
        var base: number = this.Base;
        var power: number = this.Power;
        if (base == 0) {
            power = 0;
        }
        else if (Math.abs(base) < 1) {
            while (Math.abs(base) < 1) {
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
        this.Base = parseFloat(base.toFixed(4));
        this.Power = power;
        return this;
    }

    /**
     * 基数
     */
    public get Base(): number {
        return this.base;
    }
    
    /**
     * 基数
     */
    public set Base(val: number) {
        this.base = val;
    }
    
    /**
     * 指数
     */
    public get Power(): number {
        return this.power;
    }
    
    /**
     * 指数
     */
    public set Power(val: number) {
        this.power = val;
    }
    
    /**
     * 字符串显示
     */
    public get ShowToString(): string {
        var str: string = "";
        var keepNum: number = 4;                        // 保留小数点后位数（包含小数点个数）
        if (this.power >= 0 && this.power < 8) {
            str = (this.base * Math.pow(10, this.power)).toString();
            var pointIndex: number = str.indexOf(".");
            if (pointIndex != -1) {
                str = str.substr(0, pointIndex);
            }
        }
        else if (this.power > 0 && this.power < 12) {
            var numStr: string = (this.base * Math.pow(10, this.power - 8)).toString();
            if (numStr.indexOf(".") == -1) {
                str = numStr.toString();
            }
            else {
                str = numStr.substr(0, numStr.indexOf(".") + keepNum)
            }
            str = str + "亿";
        }
        else if (this.power > 0 && this.power < 16) {
            var numStr: string = (this.base * Math.pow(10, this.power - 12)).toString();
            if (numStr.indexOf(".") == -1) {
                str = numStr.toString();
            }
            else {
                str = numStr.substr(0, numStr.indexOf(".") + keepNum)
            }
            str = str + "万亿";
        }
        else {
            var numStr: string = this.base.toString();
            if (numStr.indexOf(".") == -1) {
                str = numStr.toString();
            }
            else {
                str = numStr.substr(0, numStr.indexOf(".") + keepNum)
            }
            str = str + "e" + this.power.toString();
        }
        return str;
    }

    /**
     * 加法
     * @param digit0  数值
     * @param digit1  数值
     * @return 结果数值
     */
    public Add(digit1: any): Digit {
        let newData = digit1 instanceof Digit ? digit1 : new Digit([digit1]);

        newData.CounterPoise();
        if(this.power > newData.power + Digit.scope){
        }
        else if(this.power < newData.power - Digit.scope){
            this.base = newData.base;
            this.power = newData.power;
        }
        else{
            this.base += newData.base / Math.pow(10, this.power - newData.power);
            this.CounterPoise();
        }
        return this;
    }
    
    /**
     * 减法
     * @param digit0  数值
     * @param digit1  数值
     * @return 结果数值
     */
    public Sub(digit1: any): Digit {
        let newData = digit1 instanceof Digit ? digit1 : new Digit([digit1]);

        newData.CounterPoise();
        if(this.power > newData.power + Digit.scope){
        }
        else if(this.power < newData.power - Digit.scope){
            this.base = -(newData.base);
            this.power = newData.power;
        }
        else{
            this.base -= newData.base / Math.pow(10, this.power - newData.power);
            this.CounterPoise();
        }
        return this;
    }
    
    /**
     * 乘法
     * @param digit0  数值
     * @param digit1  数值
     * @return 结果数值
     */
    public Mul(digit1: any): Digit {
        let newData = digit1 instanceof Digit ? digit1 : new Digit([digit1]);

        this.Base = this.Base * newData.Base;
        this.Power = this.Power + newData.Power;
        this.CounterPoise();
        return this;
    }

    /**
     * 除法
     * @param digit0  数值
     * @param digit1  数值
     * @return 结果数值
     */
    public Div(digit1: any): Digit {
        let newData = digit1 instanceof Digit ? digit1 : new Digit([digit1]);

        this.Base = this.Base / newData.Base;
        this.Power = this.Power - newData.Power;
        this.CounterPoise();
        return this;
    }
    
    /**
     * 将大数值转为普通数值
     */
    public get Number(): number{
        this.CounterPoise();
        if(this.power > 300){
            // console.log('Calc Infinity');
            this.power = 300;
        }
        return this.base * Math.pow(10, this.power);
    }

    /**
     * 倍数增长
     */
    public SetUpNum($num: number): Digit{
        this.base *= $num;
        this.CounterPoise();
        if(this.power > 300){
            this.power = 300;
        }

        return this;
    }

    /**
     * 计算经过效果增强后的数值
     */
    public CalcFinallyValue($typeList:Array<number>): Digit{
        $typeList.map($tp => {
            this.base = FacadeApp.Calc($tp, this.base);
        });
        return this.CounterPoise();
    }

    // 变量
    private base: number;              // 基数
    private power: number;             // 指数
} 