/**
 * 角色物理层级
 */
class PVPRolePhysics {
	/**
	 * 构造方法
	 */
	public constructor() {
		this._CreateWorld();
		this._CreateGround();
		this._CreateBody();
	}

	/**
	 * 创建世界
	 */
	private _CreateWorld(){
		this._world = new p2.World({gravity:[0, -10 * this._multiple]});
	}

	/**
	 * 创建地板
	 */
	private _CreateGround(){
		var gshape: p2.Plane = new p2.Plane();
		this._gBody = new p2.Body({position:[0, 0]});
		this._gBody.addShape(gshape);
		this._world.addBody(this._gBody);
	}

	/**
	 * 创建body
	 */
	private _CreateBody(){
		var box: p2.Box = new p2.Box({width:1, height: 1});
		this._roleBody = new p2.Body({ mass: 1,position: [0, 0.5]});
		this._roleBody.fixedX = true;
		this._roleBody.addShape(box);
		this._roleBody.updateAABB();
		this._roleBody.updateMassProperties();
		this._world.addBody(this._roleBody);
	}

	/**
	 * 创建body2
	 */
	private _CreateBody2(){
		var box: p2.Box = new p2.Box({width:1, height: 1});
		this._roleBody2 = new p2.Body({ mass: 1,position: [250, 0.5]});
		this._roleBody2.fixedX = true;
		this._roleBody2.addShape(box);
		this._roleBody2.updateAABB();
		this._roleBody2.updateMassProperties();
		this._world.addBody(this._roleBody2);
	}

    /**
     * 计时更新
     * @param frameTime 调用时间间隔
     */
    private _Process(frameTime: number){
		this._world.step(frameTime / 1000);
		// console.log(this.RoleY, this._roleBody.position[1]);
		// if (this._minY > this.RoleY){
		// 	this._minY = this.RoleY;
		// 	console.log(this._minY);
		// }
	}

	/**
	 * 点击响应
	 */
	public Jump(velocity: number){
		// this._minY = 0;
		// velocity = velocity / Game.SpeedMul;
		this._roleBody.velocity = [velocity * this._multiple, 0];
	}

	/**
	 * 向前移动
	 */
	public Move(velocity: number){
		// this._minY = 0;
		// velocity = velocity / Game.SpeedMul;
		this._roleBody.velocity = [velocity * this._multiple,0];
	}

	/**
	 * 角色位置
	 */
	public get RoleX(): number{
		var roleX: number = Math.floor(-this._roleBody.position[0] * this._factor + this._factor / 2);
		// var roleX: number = Math.floor(-this._roleBody.position[0] * this._factor + this._factor / 2);
		// var roleY: number = Math.floor(-this._roleBody.position[1] * this._factor + this._factor / 2);
		return roleX;
	}

	/**
	 * 角色位置2
	 */
	public get RoleX2(): number{
		var roleX: number = Math.floor(-this._roleBody2.position[0] * this._factor + this._factor / 2);
		// var roleX: number = Math.floor(-this._roleBody2.position[0] * this._factor + this._factor / 2) * Math.pow(10, 2);
		// var roleY: number = Math.floor(-this._roleBody.position[1] * this._factor + this._factor / 2);
		return roleX;
	}

	/**
	 * 初始化角色位置
	 */
	public InitRole(){
		this._roleBody.position[1] = 0.5;
		this._roleBody.updateMassProperties();
	}


	private _world: p2.World;
	private _gBody: p2.Body;
	private _roleBody: p2.Body;
	private _roleBody2: p2.Body;
	private _factor: number = 100;
	private _multiple: number = 1.4;
	private _minY: number = 0;
}