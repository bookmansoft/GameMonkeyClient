/**
 * 和UIPage对应的Mediator，会在UIPage加载完成后自动注册到Facade
 */
class UIPageMediator extends puremvc.Mediator implements puremvc.IMediator {
    /**
     * 和指定UI建立关联，为UI上的控件订阅界面事件，并提供对应的响应函数
     */
    public constructor(viewComponent: any) {
        super(ViewerName.UIPageMediator, viewComponent);

        // 监听UI事件
        this.page._cardButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._ShowPanel, this);
        this.page._petButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._ShowPanel, this);
        this.page._amuletButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._ShowPanel, this);
        // this.page._gonghui.addEventListener(egret.TouchEvent.TOUCH_TAP, this._ShowPanel, this);
        this.page._shopButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._ShowPanel, this);
        this.page._talismanButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._ShowPanel, this);

        this.page._dailyTaskButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnButtonClick, this);
        this.page._giveUpBossButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnButtonClick, this);
        this.page._putAwayButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this._OnButtonClick,this);
        this.page._setButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnButtonClick, this);
        this.page._rankingButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnButtonClick, this);
        this.page._mailButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnButtonClick, this);
        this.page._sjfButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnButtonClick, this);
        this.page._hangUpingButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnButtonClick, this);
        this.page._buddhaButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnButtonClick, this);
        this.page._achievementButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnButtonClick, this);
        this.page._passRewardsButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnButtonClick, this);
        this.page._offlineRewardsButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnButtonClick, this);
        this.page._hangUpRewardsButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnButtonClick, this);
        this.page._activeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnButtonClick, this);

        // 获取数据，法宝，战斗力，点击战斗力
        FacadeApp.fetchData([CommandList.M_NET_TalismanNum, "&oper=1", "&id&pm"], [data => {
            FacadeApp.dispatchAction(CommandList.M_DAT_TalismanList, data['data']);
            FacadeApp.dispatchAction(CommandList.M_AT_STATUS_Power, data['data']['power']);
            FacadeApp.dispatchAction(CommandList.M_DAT_Status_PowerClick, data['data']['powerClick']);
            if(data["code"] == FacadeApp.SuccessCode){

            }else{
                UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
            }
        }]);

        // 刷新界面
        this.RegisterDataSource();
    }

    /**
     * 订阅和数据仓库相关的事件，当数据更新时自动刷新界面
     */
    public RegisterDataSource(){
        this.page.RegisterDataSource([
            CommandList.M_CMD_FIGHT_GiveUpOrFight, 
            CommandList.SetTollgateProgress,
            CommandList.M_DAT_Change_Money,      //修改金币数值
            CommandList.M_DAT_Status_PowerClick, 
            CommandList.M_AT_STATUS_Power, 
            CommandList.M_AT_STATUSLIST,
            CommandList.M_AT_SyncCheckpoint,
            // CommandList.BossLifeProgress,
            // CommandList.BOSSTIME,
            // CommandList.BOSSBONUS,
        ]);
    }

    /**
     * 在这里书写所有需要订阅的消息
     */
    public listNotificationInterests(): Array<any> {
        return [
            // CommandList.M_CMD_ShowAmuletPokedex, 
            CommandList.M_CMD_ShowAmuletDetail, 
            CommandList.M_CMD_ShowCard,
            CommandList.M_CMD_ShowTalisman,
            CommandList.M_CMD_UiOpened_Buddha,
            CommandList.M_CMD_UiOpened_BuddhaMgr,
            CommandList.M_CMD_ShowPVPMarshalling,
            CommandList.M_CMD_ShowPVPFightWindow,
            CommandList.M_CMD_SkillStatus,
            CommandList.M_MS_FightStatusChg,
            CommandList.M_CMD_ShowPVPVS,
            CommandList.M_CMD_UiOpened_ActivityRule,
            // CommandList.BossLifeProgress,
            // CommandList.BOSSTIME,
            // CommandList.BOSSBONUS,
        ];
    }

    /**
     * 在这里处理所有订阅的消息
     */
    public handleNotification(notification: puremvc.INotification): void {
        switch (notification.getName()) {
            case CommandList.M_CMD_UiOpened_Buddha:         // 显示佛光管理界面
                this.page.ShowBuddhaManagerWindow();
                break;
            case CommandList.M_CMD_UiOpened_BuddhaMgr:      // 显示佛光守护界面
                this.page.ShowBuddhaGuardWindow();
                break;
            // case CommandList.M_CMD_ShowAmuletPokedex:              // 显示符咒图鉴界面
            //     this.page.ShowAmuletPokedexWindow();
            //     break;
            case CommandList.M_CMD_ShowAmuletDetail:        // 显示符咒详情界面
                this.page.ShowAmuletDetail(notification.getBody());
                break;
            case CommandList.M_CMD_ShowCard:               // 显示神魔详情界面
                this.page.ShowCardDetail(notification.getBody());
                break;
            case CommandList.M_CMD_ShowTalisman:                // 显示法宝详情界面
                this.page.ShowTalismanDetail(notification.getBody());
                break;
             case CommandList.M_CMD_ShowPVPMarshalling:          // 显示PVP编组界面
                this.page.ShowPVPMarshallingWindow(notification.getBody());
                break;
            case CommandList.M_CMD_ShowPVPFightWindow:      // 显示PVP战斗界面
                this.page.ShowPVPFightWindow();
                break;
            case CommandList.M_CMD_SkillStatus:             // 更新主动技能状态
                let data = notification.getBody();
                if(data != null){
                    this.page.UpdateSkill(data);
                }else{
                    for(let i = 0; i < SkillManager.ActiveSkill.length; i++){
                        this.page.UpdateSkill(SkillManager.ActiveSkill[i].ID);
                    }
                }
                break;
            case CommandList.M_MS_FightStatusChg:            // 判断是否在战斗，更新是否可以点击
                this.page.UpdateIsFighting();
                break;
            case CommandList.M_CMD_ShowPVPVS:
                this.page.ShowPVPVS(notification.getBody());
                break;
            case CommandList.M_CMD_UiOpened_ActivityRule:
                this.page.ShowActivityRule();
                break;
            // case CommandList.BossLifeProgress:               // 更新boss血量进度值
            //     this.page.UpdateBossLifeProgress(notification.getBody());
            //     break;
            // case CommandList.BOSSTIME:                       // 更新打boss倒计时
            //     this.page.UpdateBossTimeProgress(notification.getBody());
            //     break;
            // case CommandList.BOSSBONUS:                      // 更新打boss可掉落奖励
            //     this.page.UpdateBossBonus(notification.getBody());
        }
    }
    /**
     * 显示面板
     */
    private _ShowPanel($e: egret.TouchEvent): void {
        switch ($e.target) {
            case this.page._petButton:
                this.page._PanelJudge("_petWindow");
                break;
            case this.page._talismanButton:
                this.page._PanelJudge("_talismanWindow");
                break;
            case this.page._amuletButton:
                this.page._PanelJudge("_amuletWindow");
                break;
            case this.page._cardButton:
                this.page._PanelJudge("_cardWindow");
                break;
            // case this.page._gonghui:
            //     this.page._PanelJudge("_gonghui");
            //     break;
            case this.page._shopButton:
                this.page._PanelJudge("_shopWindow");
                break;
            default:
                break;
        }
    }

    /**
     * 按钮点击响应，出现相对于的界面
     */
    public _OnButtonClick(event: egret.TouchEvent){
        SoundManager.PlayButtonMusic();
        switch(event.target){
            case this.page._dailyTaskButton.Button: 
                this.page.ShowDailyTaskWindow();
                break;
            case this.page._hangUpRewardsButton.Button: 
                this.page.ShowHangUpRewardsWindow();
                break;
            case this.page._passRewardsButton.Button: 
                this.page.ShowPassRewardWindow(); 
                break;
            case this.page._offlineRewardsButton.Button: 
                this.page.ShowOfflineRewardsWindow(); 
                break;
            case this.page._hangUpingButton.Button: 
                this.page.ShowHangUpTipWindow(); 
                break;
            case this.page._sjfButton.Button: 
                this.page.ShowSJFWindow(); 
                break;
            case this.page._mailButton.Button: 
                this.page.ShowMailWindow(); 
                break;
            case this.page._buddhaButton.Button: 
                let fgPoint = FacadeApp.read(CommandList.Re_Status).totem;
                if(fgPoint > 0){ //如果有多余的佛光，就打开随机分配界面
                    FacadeApp.Notify(CommandList.M_CMD_UiOpened_BuddhaMgr);
                }
                else{ //否则直接打开佛光管理界面
                    FacadeApp.Notify(CommandList.M_CMD_UiOpened_Buddha);
                }
            break;
            case this.page._rankingButton:
                this.page.ShowRankWindow();
                break;
            case this.page._setButton:
                this.page.ShowSetWindow();
                break;
            case this.page._activeButton: 
				this.page.ShowIntegralWindow();
                break;
            case this.page._achievementButton: 
                this.page.ShowAchievementWindow(); 
                break;
            case this.page._putAwayButton: 
                this.page._putAwayGroup.visible =! this.page._putAwayButton.selected;
            break;
            case this.page._giveUpBossButton: 
                if (this.page._giveUpBossButton.selected) {
                    FacadeApp.dispatchAction(CommandList.M_CMD_FIGHT_GiveUpOrFight, "giveup");
                }
                else{ 
                    FacadeApp.dispatchAction(CommandList.M_CMD_FIGHT_GiveUpOrFight, "fight");
                }
            break;
            
        }
    }

    
    /**
     * 返回关联的UI单元
     */
    public get page(): UIPage {
        return <UIPage><any>(this.viewComponent);
    }
}
