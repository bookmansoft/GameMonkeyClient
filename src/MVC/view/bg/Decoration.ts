/**
 * 近景
 */
class Decoration extends egret.Sprite {
	/**
	 * 背景单例
	 */
	private static _instance: Decoration;
	/**
	 * 背景单例2
	 */
	private static _instance2: Decoration;
	/**
	 * 图片
	 */
	private _image: eui.Image;
	/**
	 * 前景数组
	 */
	private _imageArr4: eui.Image[] = [];
	
	/**
	 * 获取背景单例
	 */
	public static GetInstance(): Decoration {
		if (!this._instance) {
			this._instance = new Decoration();
			this._instance._Init();
		}
		return this._instance;
	}
	/**
	 * 获取背景单例
	 */
	public static GetInstance2(): Decoration {
		if (!this._instance2) {
			this._instance2 = new Decoration();
			this._instance2._Init();
		}
		return this._instance2;
	}

	/**
	 * 初始化背景
	 */
	private _Init(): void {
		for (var n = 0; n < 2; n++) {
			this._image = new eui.Image();
			this._image.source = RES.getRes("qianjing1_png");
			this._image.x = n * 2488;
			this.addChild(this._image);
			this._imageArr4.push(this._image);
		}
	}

	/**
	 * 判断位置
	 */
	private _SetPosition(): void {
		if (this._imageArr4[0].x < -2488) {
			this._imageArr4[0].x = this._imageArr4[1].x + 2488;
			this._imageArr4.push(this._imageArr4[0]);
			this._imageArr4.splice(0, 1);
		}
	}

	/**
	 * 移动图片
	 * @param $x 移动距离
	 * @param $t 移动时间
	 */
	public move($x: number, $t: number): void {
		this._SetPosition();
		for (var n: number = 0; n < 2; n++) {
			egret.Tween.removeTweens(this._imageArr4[n]);
			var tw4 = egret.Tween.get(this._imageArr4[n]);
			var tx4: number = this._imageArr4[n].x - $x * 1.2;
			tw4.to({ x: tx4 }, $t);
		}
	}
	
	/**
	 * 移除装饰（藤条）tween
	 */
	public RemoveTween(): void {
		for (var n: number = 0; n < 2; n++) {
			egret.Tween.removeTweens(this._imageArr4[n]);
		}
	}
}