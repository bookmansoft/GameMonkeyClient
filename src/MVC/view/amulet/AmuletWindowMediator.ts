/**
 * 和舞台对应的Mediator
 */
class AmuletWindowMediator extends puremvc.Mediator implements puremvc.IMediator {
    /**
     * 和指定UI建立关联，为UI上的控件订阅界面事件，并提供对应的响应函数
     */
    public constructor(viewComponent: any) {
        super(ViewerName.AmuletWindowMediator, viewComponent);
        this.RegisterDataSourceFun();
    }

    /**
     * 订阅和数据仓库相关的事件，当数据更新时自动刷新界面
     */
    public RegisterDataSourceFun(){
        this.page.RegisterDataSource([
            CommandList.M_DAT_Amulet,
            CommandList.M_DAT_Change_Money,
        ]);
    }

    /**
     * 在这里书写所有需要订阅的消息
     */
    public listNotificationInterests(): Array<any> {
        return [
            CommandList.M_CMD_UiOpened_Amulet,
        ];
    }

    /**
     * 在这里处理所有订阅的消息
     */
    public handleNotification(notification: puremvc.INotification): void {
        switch (notification.getName()) {
            case CommandList.M_CMD_UiOpened_Amulet:
                FacadeApp.fetchData([CommandList.M_NET_Amulet, "&oper=1&id=0&pm=0"], [data => {
                    if(data["code"] == FacadeApp.SuccessCode){
                        
                    }else{
                        UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
                    }
                    //将网络数据保存到数据仓库，自动触发数据更新
                    FacadeApp.dispatchAction(CommandList.M_DAT_Amulet, data['data']);
                }]);
                if(FacadeApp.read(CommandList.Re_Status).guideId == 2) GuideWindow.inst(GuideWindow).GuideFinish(FacadeApp.read(CommandList.Re_Status).guideId);//新手引导第2步
                break;
        }
    }

    /**
     * 返回关联的UI单元
     */
    public get page(): AmuletWindow {
        return <AmuletWindow><any>(this.viewComponent);
    }
}
