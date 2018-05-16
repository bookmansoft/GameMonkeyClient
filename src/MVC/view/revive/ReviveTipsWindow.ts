/**
 *  转生贴士界面
 */
class ReviveTipsWindow extends APanel{
    /**
     * 构造方法
     */
    public constructor() {
        super("resource/game_skins/revive/ReviveTipsWindowSkins.exml"); 
    }

    /**
     * 素材加载完毕时自动调用
     */
    public ComponentWillMount(){
		this._sureBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCloseClick, this);
    }

    /**
     * 被添加到舞台时自动调用
     * 注：目前的机制并不能保证ComponentWillMount先于ComponentDidMount被调用
     */
    public ComponentDidMount(){
    }

    /**
     * 访问页面，刷新
     */
    public onAccess(){
        super.onAccess();
        let _num: number = FacadeApp.read(CommandList.Re_FightInfo).aStone;
        this._neidangLabel.text = _num.toString();
        this._addPetGongJiLabel.text = `${_num/10}%`;
        this._addRoleGongJiLabel.text = `${_num/10}%`;
    }

    /**
     * 我知道了按钮响应
     */
    private _OnCloseClick(event : egret.TouchEvent){
        SoundManager.PlayCloseWinMusic();
        this.UnRegister();
    }

    // 变量
    private _neidangLabel : eui.Label;         			// 本次转生共获得内丹
	private _addPetGongJiLabel : eui.Label;         	// 每个修为可提供的人物攻击力
    private _addRoleGongJiLabel : eui.Label;            // 每个修为可提供的宠物攻击力

	private _sureBtn : eui.Button;						// 确定按钮
}