/**
 * 背景
 */
class BG extends egret.Sprite {
	/**
	 * 背景单例
	 */
	private static _instance: BG;
	/**
	 * 背景单例2
	 */
	private static _instance2: BG;
	/**
	 * 图片
	 */
	private _image: eui.Image;
	/**
	 * 远景数组
	 */
	private _imageArr1: eui.Image[] = [];
	/**
	 * 近景数组
	 */
	private _imageArr2: eui.Image[] = [];
	/**
	 * 地面数组
	 */
	private _imageArr3: eui.Image[] = [];
	
	/**
	 * 获取背景单例
	 */
	public static GetInstance(): BG {
		if (!this._instance) {
			this._instance = new BG();
			this._instance._InIt();
		}
		return this._instance;
	}
	/**
	 * 获取背景单例
	 */
	public static GetInstance2(): BG {
		if (!this._instance2) {
			this._instance2 = new BG();
			this._instance2._InIt();
			this._instance2.SetPVPBG();
		}
		return this._instance2;
	}
	/**
	 * 初始化背景
	 */
	private _InIt(): void {
		for (var n: number = -1; n < 2; n++) {
			this._image = new eui.Image();
			this._image.source = RES.getRes("yuanjing1_jpg");
			this._image.x = n * 1420;
			this.addChild(this._image);
			this._imageArr1.push(this._image);
		}
		for (n = -1; n < 2; n++) {
			this._image = new eui.Image();
			this._image.source = RES.getRes("jinjing1_png");
			this._image.x = n * 1845;
			this.addChild(this._image);
			this._imageArr2.push(this._image);
		}

		for (n = -1; n < 2; n++) {
			this._image = new eui.Image();
			this._image.source = RES.getRes("dimian1_png");
			this._image.x = n * 2488;
			this.addChild(this._image);
			this._imageArr3.push(this._image);
		}
	}

	/**
	 * 设置PVP背景
	 */
	private SetPVPBG(): void {
		for (var n: number = 0; n < this._imageArr1.length; n++) {
			this._imageArr1[n].source = "yuanjing2_jpg";
		}
		for (n = 0; n < this._imageArr2.length; n++) {
			this._imageArr2[n].source = "jinjing2_png";
		}

		for (n = 0; n < this._imageArr3.length; n++) {
			this._imageArr3[n].source = "dimian2_png";
		}
	}

	/**
	 * 判断位置
	 */
	private _SetPosition(): void {
		// 角色向右移动，背景向左移动，左边限制
		// for(let i=0; i<this._imageArr1.length; i++){
		// 	if(this._imageArr1)
		// }


		if (this._imageArr1[0].x < -1420*2) {
			this._imageArr1[0].x = this._imageArr1[2].x + 1420;
			this._imageArr1.push(this._imageArr1[0]);
			this._imageArr1.splice(0, 1);
		}

		if (this._imageArr2[0].x < -1845*2) {
			this._imageArr2[0].x = this._imageArr2[2].x + 1845;
			this._imageArr2.push(this._imageArr2[0]);
			this._imageArr2.splice(0, 1);
		}

		if (this._imageArr3[0].x < -2488*2) {
			this._imageArr3[0].x = this._imageArr3[2].x + 2488;
			this._imageArr3.push(this._imageArr3[0]);
			this._imageArr3.splice(0, 1);
		}

		// 角色向左移动，背景向右移动，右边限制
		if (this._imageArr1[2].x > 1420*2) {
			this._imageArr1[2].x = this._imageArr1[0].x - 1420;
			// this._imageArr1.push(this._imageArr1[2]);
			let a = this._imageArr1[2];
			this._imageArr1.splice(2, 1);
			this._imageArr1.splice(0, 0, a);
		}

		if (this._imageArr2[2].x > 1845*2) {
			this._imageArr2[2].x = this._imageArr2[0].x - 1845;
			// this._imageArr2.push(this._imageArr2[2]);
			let a = this._imageArr2[2];
			this._imageArr2.splice(2, 1);
			this._imageArr2.splice(0, 0, a);
			// this._imageArr1.splice(0, 0,this._imageArr1[2]);
			// this._imageArr2.splice(0, 1);
		}

		if (this._imageArr3[2].x > 2488*2) {
			this._imageArr3[2].x = this._imageArr3[0].x - 2488;
			// this._imageArr3.push(this._imageArr3[2]);
			let a = this._imageArr3[2];
			this._imageArr3.splice(2, 1);
			this._imageArr3.splice(0, 0, a);
			// this._imageArr1.splice(0, 0,this._imageArr1[2]);
			// this._imageArr3.splice(0, 1);
		}
	}

	/**
	 * 移动图片
	 * @param $x移动距离
	 * @param $t移动时间
	 */
	public Move($x: number, $t: number): void {
		this._SetPosition();
		for (var n: number = 0; n < 3; n++) {
			egret.Tween.removeTweens(this._imageArr1[n]);
			var tw1 = egret.Tween.get(this._imageArr1[n]);
			var tx1: number = this._imageArr1[n].x - $x * 0.6;
			tw1.to({ x: tx1 }, $t);

			egret.Tween.removeTweens(this._imageArr2[n]);
			var tw2 = egret.Tween.get(this._imageArr2[n]);
			var tx2: number = this._imageArr2[n].x - $x * 0.8;
			tw2.to({ x: tx2 }, $t);

			egret.Tween.removeTweens(this._imageArr3[n]);
			var tw3 = egret.Tween.get(this._imageArr3[n]);
			var tx3: number = this._imageArr3[n].x - $x;
			tw3.to({ x: tx3 }, $t);
		}
		Decoration.GetInstance().move($x, $t);
	}
	
	/**
	 * 移除背景tween
	 */
	public RemoveTween(): void {
		for (var n: number = 0; n < 3; n++) {
			egret.Tween.removeTweens(this._imageArr1[n]);
			egret.Tween.removeTweens(this._imageArr2[n]);
			egret.Tween.removeTweens(this._imageArr3[n]);
		}
	}
}