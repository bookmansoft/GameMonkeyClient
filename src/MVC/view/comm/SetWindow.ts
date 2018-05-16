/**
 *  设置界面
 */
class SetWindow extends APanel{
    /**
     * 构造方法
     */
    public constructor() {
        super("resource/game_skins/ui/SetWindowSkins.exml");
    }

    /**
     * 素材加载完毕时自动调用
     */
    public ComponentWillMount(){
        this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCloseClick, this);
        this._dhButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnDHClick, this);
        this._gmButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnGMClick, this);
        this._panelCloseButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnPanelCloseClick, this);
        this._gmqrButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnQRGMClick, this);
        this._yinyueCheck.addEventListener(egret.Event.CHANGE, this._OnYinyueChange, this);
        this._yinxiaoCheck.addEventListener(egret.Event.CHANGE, this._OnYinxiaoChange, this);

        this._idLabel.filters= [FilterManage.AddMiaoBian(3,0x2e1100)];
        this._Init();
    }

    /**
     * 被添加到舞台时自动调用
     * 注：目前的机制并不能保证ComponentWillMount先于ComponentDidMount被调用
     */
    public ComponentDidMount(){
        // 发出界面已打开事件，界面介质需要事先登记该事件，并在事件发生时进行响应
        FacadeApp.Notify(CommandList.M_CMD_UiOpened_Pet);
    }

    /**
     * 初始化信息
     */
    private _Init(){
        this._yinyueCheck.selected = true;
        this._yinxiaoCheck.selected = true;
        this._tongzhiCheck.selected = true;
        this._tixingCheck.selected = true;
        this._setNameGroup.visible = false;
        this._nameLabel.text = UnitManager.Player.Name;
        this._idLabel.text = "ID:" + UnitManager.Player.ID.toString();
    }

    /**
     * 音乐状态改变响应
     */
    private _OnYinyueChange(event: egret.Event){
        // SoundManager.YinYue = this._yinyueCheck.selected;
        SoundManager.StopBackgroundMusic();
    }

    /**
     * 音效状态改变响应
     */
    private _OnYinxiaoChange(event: egret.Event){
        SoundManager.YinXiao = this._yinxiaoCheck.selected;
    }

    /**
     * 关闭点击响应
     */
    private _OnCloseClick(event: egret.TouchEvent){
        SoundManager.PlayCloseWinMusic();
        this.UnRegister();
    }

    /**
     * 更名点击响应
     */
    private _OnGMClick(event: egret.TouchEvent){
        SoundManager.PlayButtonMusic();
        this._setNameGroup.visible = true;
        this._gmLabel.text = UnitManager.Player.Name;
    }

    /**
     * 对话点击响应
     */
    private _OnDHClick(event: egret.TouchEvent){
        SoundManager.PlayButtonMusic();
    }

    /**
     * 命名界面关闭点击响应
     */
    private _OnPanelCloseClick(event: egret.TouchEvent){
        SoundManager.PlayCloseWinMusic();
        this._setNameGroup.visible = false;
    }

    /**
     * 更名确认
     */
    private _OnQRGMClick(event: egret.TouchEvent){
        SoundManager.PlayButtonMusic();
        var text: string = this._gmLabel.text;
        if (text == null || text == "") return;
        UnitManager.Player.Name = text;
        this._nameLabel.text = text;
        this._setNameGroup.visible = false;
    }

    // 变量
    private _gmButton: eui.Button;                      // 更名按钮
    private _dhButton: eui.Button;                      // 兑换按钮
    private _yinyueCheck: eui.CheckBox;                 // 音乐开关
    private _yinxiaoCheck: eui.CheckBox;                // 音效开关
    private _tongzhiCheck: eui.CheckBox;                // 通知开关
    private _tixingCheck: eui.CheckBox;                 // 提醒开关
    private _nameLabel: eui.Label;                      // 名字文本
    private _idLabel: eui.Label;                        // ID文本
    private _closeButton: eui.Button;                   // 关闭按钮
    private _setNameGroup: eui.Group;                   // 设置名字框
    private _gmqrButton: eui.Button;                    // 确认更名按钮
    private _consumeLabel: eui.Label;                   // 消耗文本
    private _gmLabel: eui.EditableText;                 // 更名文本
    private _panelCloseButton: eui.Button;              // 关闭框体按钮
}