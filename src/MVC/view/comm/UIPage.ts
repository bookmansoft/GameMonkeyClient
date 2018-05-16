/**
 * 主界面
 * 
 * @todo
 * 实现点击攻击、普通攻击的精确计算。点击攻击由宠物自身点击攻击力、普攻转点击攻击、点击攻击加成等因素决定 OK
 * 怪物类型数组是如何管理？进入新的关卡时，首先生成模板序列，然后根据模板序列不断克隆新的小怪，以保持屏幕上小怪数量的稳定，直至达到本关怪物量上限 OK
 * 注意ts中，Digit类型和{base:0, power:0}完全不是一回事儿，前者instanceof Digit为真，后者只是一个Object
 * 血条不见了 OK
 * 过关时怪物并没有被全部消灭 OK
 * 老怪没有按照设定出现 OK
 * 进入无限模式下可以持续攻打小怪，只有主动操作才会重新冲关 OK
 * 开始调测普通宠物的购买、碎片激活、升级、切换操作 OK
 * 宠物升级后，宠物面板和主界面上的点击攻击力都要同步变化 OK  
 */
class UIPage extends APanel {
    /**
     * 构造方法
     */
    public constructor() {
        super("resource/game_skins/ui/UI.exml");
        FacadeApp.inst.registerMediator(new UIPageMediator(this)); //注册Mediator
    }
    /**
     * 组件加载完成
     */
    public ComponentWillMount(){
        // FacadeApp.AddListener(CommandList.M_MS_FightStatusChg, this.UpdateIsFighting.bind(this));
        FacadeApp.AddListener(CommandList.BossLifeProgress, this.UpdateBossLifeProgress.bind(this));
        FacadeApp.AddListener(CommandList.BOSSTIME, this.UpdateBossTimeProgress.bind(this));
        FacadeApp.AddListener(CommandList.BOSSBONUS, this.UpdateBossBonus.bind(this));

        this._putAwayButton.touchEnabled = true;
        this._clickNumLabel.textAlign = egret.HorizontalAlign.CENTER;
        this._shopButton.x = this._gonghui.x;
        this._gonghui.visible = false;

        //布局 下面图标平均分布
        this._petButton.x = 0+30;
        this._talismanButton.x = 640/5*1+30;
        this._amuletButton.x = 640/5*2+30;
        this._cardButton.x = 640/5*3+30;
        this._shopButton.x = 640/5*4+30;
        this._bossLifeUI["lifeProgressBar"].slideDuration = 500;
        this._bossLifeUI["timeProgressBar"].slideDuration = 500;

        // 创建主动技能
        this._activeSkillLineSet = [];
        for (var i = 0; i < SkillManager.ActiveSkill.length; i++){
            var _activeSkill: ActiveSkillLine = new ActiveSkillLine(i, SkillManager.ActiveSkill[i].ID);
            _activeSkill.x = this._activeSkillPosiSet[i][0]; //this["_skillButton" + i].x + this["_skillButton" + i].width / 2;
            _activeSkill.y = this._activeSkillPosiSet[i][1]; //this["_skillButton" + i].y + this["_skillButton" + i].height / 2;
            this._skillComponent.addChild(_activeSkill);
            this._activeSkillLineSet[i] = _activeSkill;
        }
        // for (var i = 1; i < 7; i++){
        //     this["_skillButton" + i].addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._OnSkillButtonClickBegin, this);
        //     this["_skillButton" + i].addEventListener(egret.TouchEvent.TOUCH_END, this._OnSkillButtonClickEnd, this);
        // }

        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._OnSkillButtonClickBegin, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this._OnSkillButtonClickEnd, this);

        FacadeApp.Notify(CommandList.M_CMD_SkillStatus);
        
        
        UIPage.IsInit = true;
        //主动触发Render
        this.Render();
        this.updateUIListButton();
    }

    /**
     * 添加到显示列表中的时候调用
     */
    public ComponentDidMount(){
    }

    /**
     * 数据更新引发的界面刷新
     */
    public async Render(){
        if (FacadeApp.read(CommandList.Re_FightInfo).UnlimitedMode()) {// 关卡模式
            this._giveUpBossButton.visible = true;
            this._beatProgressLabel.visible = false;
        }
        else {
            this._giveUpBossButton.visible = false;
            this._beatProgressLabel.visible = true;
        }

        this.UpdateBeatProgress();
        this.UpdateBossLifeProgress();
        this.UpdateLevel();
        this.updateProperties();
        this.UpdateUiButtonPosi();
    }

    /**
     * 初始化ui弹框按钮
     */
    private updateUIListButton(){
        this._mailButton.updateShowButton("邮件");
        this._dailyTaskButton.updateShowButton("每日");
        this._buddhaButton.updateShowButton("佛光");
        this._sjfButton.updateShowButton("三界符");
        this._hangUpingButton.updateShowButton("挂机");
        this._offlineRewardsButton.updateShowButton("离线奖励");
        this._passRewardsButton.updateShowButton("过关奖励");
        this._hangUpRewardsButton.updateShowButton("挂机奖励");
    }

    /**
     * 更新基本属性：攻击力、元宝、金币、魂石等
     */
    public updateProperties(){
        let si = FacadeApp.read(CommandList.Re_Status);

        this._diamondLabel.text = si.diamond.toString();
        this._moneyLabel.text = Digit.fromObject(si.money).ShowToString;
        this._roleGJLabel.text = Digit.fromObject(si.power).ShowToString;
        this._petGJLabel.text = Digit.fromObject(si.powerClick).ShowToString;

        //美术资源命名反了，此处强行调个个儿
        this._stoneNumLabel.text = si.stoneHero.toString(); 
        this._stoneHeroNumLabel.text = si.stone.toString();

        let om:Digit = Digit.fromObject(FacadeApp.read(CommandList.Re_Status).offline);

        //设置按钮的激活状态
        om.Larger(0) ? this.SetButtonActive(ButtonActiveStatus.OfflineButton) : this.SetButtonUnactive(ButtonActiveStatus.OfflineButton);
        
        this.SetButtonUnactive(ButtonActiveStatus.BonusOfPassGate); //过关奖励，由于暂时没有判断依据，先封闭
        this.SetButtonUnactive(ButtonActiveStatus.HangupBonusButton);//挂机奖励，由于暂时没有判断依据，先封闭
    }

    /**
     * 更新是否正在战斗
     */
    public UpdateIsFighting(): void {
        if (SoldierManage.FightManager.GetInstance().status.current == SoldierManage.FightStatusList.running) {
            this._giveUpBossButton.touchEnabled = true;
        }
        else {
            this._giveUpBossButton.touchEnabled = false;
        }
    }

    /**
     * 更新击败进度
     */
    public UpdateBeatProgress(): void {
        this._beatProgressLabel.text = FacadeApp.read(CommandList.Re_FightInfo)._monsterCount + "/" + FacadeApp.read(CommandList.Re_FightInfo).TOTALMONSTER;
    }

    /**
     * 更新关卡
     */
    private UpdateLevel(): void {
        var level: number = FacadeApp.read(CommandList.Re_FightInfo).LEVEL;
        //前
        if (level > 1) {
            this._prevComponent.visible = true;
            this._prevComponent["bigImage"].visible = false;
            this._prevComponent["smallImage"].visible = false;
            this._prevComponent["bigBossImage"].visible = false;
            this._prevComponent["smallBossImage"].visible = false;
            this._prevComponent["label"].visible = false;

            if ((level - 1) % ConfigStaticManager.bossLevel == 0) {
                this._prevComponent["smallBossImage"].visible = true;
            }
            else {
                this._prevComponent["smallImage"].visible = true;
                this._prevComponent["label"].visible = true;
                this._prevComponent["label"].text = (level - 1).toString();
            }
        }
        else
        { this._prevComponent.visible = false; }


        //中
        this._middleComponent["smallImage"].visible = false;
        this._middleComponent["bigImage"].visible = false;
        this._middleComponent["smallImage"].visible = false;
        this._middleComponent["bigBossImage"].visible = false;
        this._middleComponent["smallBossImage"].visible = false;
        this._middleComponent["label"].visible = false;
        if (level % ConfigStaticManager.bossLevel == 0) {
            this._middleComponent["bigBossImage"].visible = true;
        }
        else {
            this._middleComponent["bigImage"].visible = true;
            this._middleComponent["label"].visible = true;
            this._middleComponent["label"].text = level.toString();
        }
        //下
        this._nextComponent["bigImage"].visible = false;
        this._nextComponent["smallImage"].visible = false;
        this._nextComponent["bigBossImage"].visible = false;
        this._nextComponent["smallBossImage"].visible = false;
        this._nextComponent["label"].visible = false;

        if ((level + 1) % ConfigStaticManager.bossLevel == 0) {
            this._nextComponent["smallBossImage"].visible = true;
        }
        else {
            this._nextComponent["smallImage"].visible = true;
            this._nextComponent["label"].visible = true;
            this._nextComponent["label"].text = (level + 1).toString();
        }

        if (level % ConfigStaticManager.bossLevel == 0) {
            this._giveUpBossButton.visible = true;
            this._giveUpBossButton.selected = false;
            this._beatProgressLabel.visible = false;
        }
        else {
            if (FacadeApp.read(CommandList.Re_FightInfo).UnlimitedMode()) {
                this._giveUpBossButton.visible = true;
                this._giveUpBossButton.selected = true;
                this._beatProgressLabel.visible = false;
            }
            else {
                this._giveUpBossButton.visible = false;
                this._beatProgressLabel.visible = true;
            }
        }

        //必须满足挂机条件才能进入挂机界面
        this.SetButtonActive(ButtonActiveStatus.HangupButton, level < (FacadeApp.read(CommandList.Re_FightInfo).his - 10));
    }

    /**
     * 更新boss血量进度
     */
    public UpdateBossLifeProgress(): void {
        this._bossLifeUI["lifeProgressBar"].value = FacadeApp.read(CommandList.Re_FightInfo).BOSSLIFEPROGRESS;
        if (this._bossLifeUI["lifeProgressBar"].value <= 0 && this._bossLifeUI.visible) {
            this._bossLifeUI.visible = false;
        }
        else if(this._bossLifeUI["lifeProgressBar"].value > 0 && !this._bossLifeUI.visible){
            this._bossLifeUI.visible = true;
        }
    }

    /**
     * 更新时间进度
     */
    public UpdateBossTimeProgress(...args): void {
        if(args[1] == null){
            if(this._bossTimeObj){
                this._bossTimeObj.destory();
            }
        }
        else if(args[1] > 0){
            if(this._bossTimeObj){
                this._bossTimeObj.destory();
            }
            this._bossTimeObj = new ChangeLabelValue(this, id => {
                this._bossLifeUI["timeLabel"].text = (this._bossTimeObj.getOriValue("boss_Time").toFixed(1)).toString() + "m";
                this._bossLifeUI["timeProgressBar"].value = (this._bossTimeObj.getOriValue("boss_Time") / ConfigStaticManager.bossTotalTime) * 100;
            }, id => {
                FacadeApp.dispatchAction(CommandList.M_CMD_FIGHT_GiveUpOrFight, "giveup"); //超时自动放弃战斗
            }, 0.1);
            this._bossTimeObj.setValue('boss_Time', args[1]);
        }
    }
    
    /**
     * 更新Boss可能的掉落物
     */
    public async UpdateBossBonus(...arg) {
        if(arg.length > 0 && arg[1].num > 0){
            this._bossLifeUI["_NDIma"].visible = true;
            this._bossLifeUI["_NDNumLabel"].visible = true;
            this._bossLifeUI["_NDIma"].texture = <egret.Texture> await MovieManage.PromisifyGetRes(arg[1].type + "_png", this); //ding_nd
            this._bossLifeUI["_NDNumLabel"].text = arg[1].num;
        }
        else{
            this._bossLifeUI["_NDIma"].visible = false;
            this._bossLifeUI["_NDNumLabel"].visible = false;
        }
    }

    /**
     * 更新技能表现
     */
    public UpdateSkill(skillID: number){
        for(let i=0; i<this._activeSkillLineSet.length; i++){
            if(this._activeSkillLineSet[i].ID == skillID){
                this._activeSkillLineSet[i].Update();
                break;
            }
        }
    }

    /**
     * 更新按钮位置，刷新激活状态。。。
     */
    public UpdateUiButtonPosi(){

        this._uiButtonArr = [this._mailButton, this._dailyTaskButton, this._buddhaButton, this._sjfButton, this._hangUpingButton, this._offlineRewardsButton, this._passRewardsButton, this._hangUpRewardsButton];

        var _height:number = 0;

        for(var i:number=0; i<this._uiButtonArr.length; i++){
            if(this._uiButtonArr[i].visible)
            {
                this._uiButtonArr[i].y = _height;
                _height += 65;
            }
        }

        if (Indicator.getChecker(this.ActiveStatus)(ButtonActiveStatus.HangupButton)) {
            this._hangUpingButton.visible = true;
        }
        else{
            this._hangUpingButton.visible = false;
        }

        if (Indicator.getChecker(this.ActiveStatus)(ButtonActiveStatus.HangupBonusButton)) {
            this._hangUpRewardsButton.visible = true;
        }
        else{
            this._hangUpRewardsButton.visible = false;
        }

        if (Indicator.getChecker(this.ActiveStatus)(ButtonActiveStatus.OfflineButton)) {
            this._offlineRewardsButton.visible = true;
            //todo: 添加激活效果，例如环绕动画。。。
        }
        else{
            this._offlineRewardsButton.visible = false;
            //todo: 取消激活效果
        }

        if (Indicator.getChecker(this.ActiveStatus)(ButtonActiveStatus.BonusOfPassGate)) {
            this._passRewardsButton.visible = true;
            //todo: 添加激活效果，例如环绕动画。。。
        }
        else{
            this._passRewardsButton.visible = false;
            //todo: 取消激活效果
        }

        // 测试，有新消息状态
        // this._mailButton.changeState("newState");
    }

    /**
     * 技能点击开始
     */
    private _OnSkillButtonClickBegin(event: egret.TouchEvent){
        let idx: number = -1;
        for (let i = 0; i < this._activeSkillLineSet.length; i++){
            if (event.target.parent == this._activeSkillLineSet[i]){
                idx = i;
                this._curSkillTipNum = idx;
                break;
            }
        }
        if(idx != -1) this._skillTipTimeOutFun = setTimeout(this.creatSkillsTips.bind(this), 500);
    }

    /**
     * 技能点击结束
     */
    private _OnSkillButtonClickEnd(event: egret.TouchEvent){
        if(this._skillTipTimeOutFun){
            clearTimeout(this._skillTipTimeOutFun);
            this._skillTipTimeOutFun = null;
            this._curSkillTipNum = -1;
        }

        if(this._activeSkillTips && this._activeSkillTips.parent){
            this._activeSkillTips.parent.removeChild(this._activeSkillTips);
        }
    }

    /**
     * 创建技能显示tips
     */
    private creatSkillsTips(){
        if(this._skillTipTimeOutFun == null){ return; }

        if(this._activeSkillTips == null){
            this._activeSkillTips = new SkillsTips();
        }
        
        this.addChild(this._activeSkillTips);
        
        if(this._curSkillTipNum > 3){
            this._activeSkillTips.x = this._activeSkillPosiSet[this._curSkillTipNum][0] - 180;
            this._activeSkillTips.changDirection(-1);
        }
        else{
            this._activeSkillTips.x = this._activeSkillPosiSet[this._curSkillTipNum][0] - 5;
            this._activeSkillTips.changDirection(1);
        }
        this._activeSkillTips.y = this._activeSkillPosiSet[this._curSkillTipNum][1] - this._activeSkillTips.height;
        this._activeSkillTips.ShowData(this._activeSkillLineSet[this._curSkillTipNum].ID);
    }

    /**
     * 设置按钮激活状态, 如果第二个参数传入false，也可以起到SetButtonUnactive的作用
     */
    public SetButtonActive(val:Number, enabled = true){
        enabled ? 
            this.ActiveStatus = Indicator.getInstance(this.ActiveStatus).set(val).indecate : 
            this.ActiveStatus = Indicator.getInstance(this.ActiveStatus).unSet(val).indecate;
    }

    /**
     * 取消按钮激活状态
     */
    public SetButtonUnactive(val:Number){
        this.ActiveStatus = Indicator.getInstance(this.ActiveStatus).unSet(val).indecate;
    }


    /**
     * 面板判断。底部弹出页面。只能存在一个
     */
    public _PanelJudge($state): void {
        if ($state == "_gonghui"){
            return;
        }

        // 如果页面存在移除。
        if(this._panel){
            if(this._panelState == $state){
                this._panel.CloseWindow();
                return;
            }else{
                this._panel.CloseWindow();
            }
        }

        this._panelState = $state;

        if ($state == "_petWindow"){
            this._panel = PetWindow.inst(PetWindow).Register(this._windowCom, false, this.closePanel.bind(this))
            .BouncedPanel(PetWindow.inst(PetWindow)._upOrDownButton.selected);
        }
        else if($state == "_talismanWindow"){
            this._panel = TalismanWindow.inst(TalismanWindow).Register(this._windowCom, false, this.closePanel.bind(this))
            .BouncedPanel(TalismanWindow.inst(TalismanWindow)._upOrDownButton.selected);
        }
        else if($state == "_amuletWindow"){
            this._panel = AmuletWindow.inst(AmuletWindow).Register(this._windowCom, false, this.closePanel.bind(this))
            .BouncedPanel(AmuletWindow.inst(AmuletWindow)._upOrDownButton.selected);
        }
        else if($state == "_cardWindow"){
            this._panel = CardWindow.inst(CardWindow).Register(this._windowCom, false, this.closePanel.bind(this))
            .BouncedPanel(false);
        }
        else if($state == "_shopWindow"){
            this._panel = ShopWindow.inst(ShopWindow).Register(this._windowCom, false, this.closePanel.bind(this))
            .BouncedPanel(ShopWindow.inst(ShopWindow)._upOrDownButton.selected);
        }
    }

    /**
     * 关闭上拉弹出页面
     */
    public closePanel(){
        this._panel = null;
        this._panelState = '';
    }

    /**
     * 过关奖励界面
     */
    public ShowPassRewardWindow(){
        return PassRewardWindow.inst(PassRewardWindow).Register(this, false);
    }

    /**
     * 离线奖励界面
     */
    public ShowOfflineRewardsWindow(){
       return OfflineRewardsWindow.inst(OfflineRewardsWindow).Register(this, false);
    }

    /**
     * 显示挂机收益界面
     */
    public ShowHangUpRewardsWindow(){
       return HangUpRewardsWindow.inst(HangUpRewardsWindow).Register(this, false);
    }

    /**
     * 挂机提示界面
     */
    public ShowHangUpTipWindow(){
       return HangUpTipWindow.inst(HangUpTipWindow).Register(this, false);
    }

    /**
     * 显示设置界面
     */
    public ShowSetWindow(){
       return SetWindow.inst(SetWindow).Register(this, false);
    }

    /**
     * 显示每日任务界面
     */
    public ShowDailyTaskWindow(){
       return DailyTaskWindow.inst(DailyTaskWindow).Register(this, false);
    }

    /**
     * 排行榜界面
     */
    public ShowRankWindow(){
       return RankingWindow.inst(RankingWindow).Register(this, false);
    }

    /**
     * 正在挂机界面
     */
    public ShowHangUpingWindow(){
        return HangUpingWindow.inst(HangUpingWindow).Register(this);
    }

    /**
     * 转生贴士界面
     */
    public ShowReviveTipsWindow(){
       return ReviveTipsWindow.inst(ReviveTipsWindow).Register(this, false);
    }

    /**
     * 选择普通或者高级转生界面
     */
    public ShowSeniorReviveWindow(){
       return SeniorReviveWindow.inst(SeniorReviveWindow).Register(this, false);
    }

    /**
     * 显示普通转生界面
     */
    public ShowZSWindow(){
       return ZSWindow.inst(ZSWindow).Register(this, false);
    }

    /**
     * 显示知道了提示弹框
     */
    public ShowPrompt(){
        return PromptWindow.inst(PromptWindow).Register(this, false);
    }

    /**
     * 显示确认取消提示弹框
     */
    public ShowConsumeTipWindow(){
        return ConsumeTipWindow.inst(ConsumeTipWindow).Register(this, false);
    }

    /**
     * 显示调整阵容界面
     */
    public ShowPVPMarshallingWindow(data){
        return MarshallingWindow.inst(MarshallingWindow).Register(this, false).show(data);
    }

    /**
     * 显示佛光守护界面
     */
    public ShowBuddhaGuardWindow(){
        return BuddhaGuardWindow.inst(BuddhaGuardWindow).Register(this, false);
    }

    /**
     * 显示佛光管理界面
     */
    public ShowBuddhaManagerWindow(){
        return BuddhaManagerWindow.inst(BuddhaManagerWindow).Register(this, false);
    }

    /**
     * 显示符咒图鉴界面
     */
    // public ShowAmuletPokedexWindow(){
    //     return AmuletPokedexWindow.inst(AmuletPokedexWindow).Register(this, false);
    // }

    /**
     * 显示PVP战斗界面
     */
    public ShowPVPFightWindow(){
        return PVPWindow.inst(PVPWindow).Register(this).EnterPVPFight();
    }

    /**
     * 显示成就界面
     */
    public ShowAchievementWindow(){
        return AchievementWindow.inst(AchievementWindow).Register(this, false);
    }

    /**
     * 显示邮箱界面
     */
    public ShowMailWindow(){
        return MailWindow.inst(MailWindow).Register(this, false);
    }

    /**
     * 显示邮箱二级界面
     */
    public ShowMailDetailWindow(mail: Object){
        return MailDetailWindow.inst(MailDetailWindow).Register(this, false).showMailContent(mail);
    }

    /**
     * 显示活动界面
     */
    public ShowIntegralWindow(){
        return IntegralWindow.inst(IntegralWindow).Register(this, false);
    }

    /**
     * 显示活动规则界面
     */
    public ShowActivityRule(){
        return IntegralRuleWindow.inst(IntegralRuleWindow).Register(this, false);
    }
    /**
     * 显示三界符界面
     */
    public ShowSJFWindow(){
        return SanJieFuWindow.inst(SanJieFuWindow).Register(this, false);
    }

    /**
     * 显示法宝详细界面
     */
    public ShowTalismanDetail(talisman: Talisman){
        if (talisman == null) return;
        return TalismanDetail.inst(TalismanDetail).Register(this, false).ShowTalisman(talisman);
    }

    /**
     * 显示宠物详细信息
     */
    public ShowPetDetail(pet: Pet){
        if (pet == null) return;
        return PetDetail.inst(PetDetail).Register(this, false).ShowPet(pet);
    }

    /**
     * 显示卡牌详细界面
     */
    public ShowCardDetail(card: Card){
        if (card == null) return;
        return CardDetail.inst(CardDetail).Register(this, false).ShowGhost(card);
    }

    /**
     * 显示PVPVS
     */
    public ShowPVPVS(data: Object){
        if (data == null) return;
        return PVPVSWindow.inst(PVPVSWindow).Register(this, false).Show(data);
    }

    // /**
    //  * 显示PVP战场结算弹框
    //  */
    // public ShowPVPEndWindow(){
    //     return PVPEndWindow.inst(PVPEndWindow).Register(this, false);
    // }

    /**
     * 显示符咒详细界面
     */
    public ShowAmuletDetail(amulet: Amulet){
        if (amulet == null) return;
        return AmuletDetail.inst(AmuletDetail).Register(this, false).ShowAmulet(amulet);
    }

    /**
     * 走马灯界面
     */
    public ShowTrottingHorseLampWindow($der:string){
        return TrottingHorseLampWindow.inst(TrottingHorseLampWindow).Register(this, false).ShowContent($der);
    }

    /**
     * 获取特效层
     */
    public get EffectGroup(){
        return this._effectGroup;
    }

    /**
     * 显示引导界面
     */
    public ShowGuideWindow(){
        return GuideWindow.inst(GuideWindow).Register(this, false);
    }


    /**
     * 按钮激活状态
     */
    private ActiveStatus: Number = 0;
    /**
     * 是否初始化
     */
    public static IsInit: boolean = false;
    /**
     * 击败怪物进度文本
     */
    public _beatProgressLabel: eui.Label;
    /**
     * 前图片
     */
    public _prevImage: eui.Image;
    /**
     * 技能面板
     */
    public _skillComponent: eui.Component;
    /**
     * 面板容器
     */
    public _windowCom: eui.Component;
    /**
     * 物品面板
     */
    private _panel: APanel;
    /**
     * 面板状态
     */
    private _panelState: string = "";
    /**
     * boss血条UI
     */
    public _bossLifeUI: eui.Component;
    /**
     * 功能图片切换按钮
     */
    public _putAwayButton:eui.ToggleButton;
    /**
     * 功能图片容器
     */
    public _putAwayGroup:eui.Group;
    private _diamondLabel : eui.BitmapLabel;// 元宝
    private _moneyLabel : eui.BitmapLabel;// 金币
    private _clickNumLabel: eui.BitmapLabel;
    /**
     * 成就
     */
    public _achievementButton: eui.Button;
    public _achievementWindow : AchievementWindow;
    /**
     * 技能按钮
     */
    // private _skillButton1: eui.Button;
    // private _skillButton2: eui.Button;
    // private _skillButton3: eui.Button;
    // private _skillButton4: eui.Button;
    // private _skillButton5: eui.Button;
    // private _skillButton6: eui.Button;
    private _activeSkillLineSet: ActiveSkillLine[];
    /**
     * 弹框按钮
     */
    public _cardButton: eui.Button;
    public _petButton: eui.Button;
    public _amuletButton: eui.Button;
    public _gonghui: eui.Button;
    public _shopButton: eui.Button;
    public _talismanButton: eui.Button;
    /**
     * 关卡
     */
    private _prevComponent: eui.Component;
    private _middleComponent: eui.Component;
    private _nextComponent: eui.Component;
    /**
     * 放弃还是战斗按钮
     */
    public _giveUpBossButton: eui.ToggleButton;
    /**
     * 设置
     */
    public _setButton: eui.Button;
    /**
     * 排行榜
     */
    public _rankingButton: eui.Button;
    /**
     * 佛光
     */
    public _buddhaButton: UIListButton;
    /**
     * 邮件
     */
    public _mailButton: UIListButton;
    /**
     * 每日任务
     */
    public _dailyTaskButton: UIListButton;
    /**
     * 三界符
     */
    public _sjfButton: UIListButton;
    /**
     * 挂机
     */
    public _hangUpingButton: UIListButton;
    /**
     * 活动
     */
    public _activeButton: eui.Button;
    /**
     * 离线奖励
     */
    public _offlineRewardsButton: UIListButton;
    /**
     * 过关奖励
     */
    public _passRewardsButton: UIListButton;
    /**
     * 挂机奖励
     */
    public _hangUpRewardsButton: UIListButton;
    /**
     * 属性文本
     */
    private _petGJLabel: eui.Label;         //  宠物攻击力
    private _roleGJLabel: eui.Label;        //  英雄攻击力
    private _stoneNumLabel: eui.Label;      //  魂石数量
    private _stoneHeroNumLabel: eui.Label;  //  英魂数量
    private _attackTotalPercent: eui.Label; //  总攻击力加成
    /**
     * 页面按钮ui集合，用于排布位置
     */
    private _uiButtonArr:any[] = [];    // 左边收拉按钮集合
    private _skillTipTimeOutFun:any = null;          // 技能提示出现时间函数
    private _activeSkillTips:SkillsTips = null;      // 技能提示
    private _curSkillTipNum:number = -1;             // 当前点击的技能编号
    private _bossTimeObj: ChangeLabelValue = null;   // boss时间计算
    private _activeSkillPosiSet = [[28,908], [129,918], [230,923], [332,923], [433,918], [534,908]]
    /**
     * 特效层级
     */
    private _effectGroup: eui.Group;
}