/**
 * 和舞台对应的Mediator
 */
class TalismanWindowMediator extends puremvc.Mediator implements puremvc.IMediator {
    /**
     * 和指定UI建立关联，为UI上的控件订阅界面事件，并提供对应的响应函数
     */
    public constructor(viewComponent: any) {
        super(ViewerName.TalismanWindowMediator, viewComponent);
        this.RegisterDataSourceFun();
    }

    /**
     * 订阅数据事件
     */
    private RegisterDataSourceFun(){
        this.page.RegisterDataSource([
            CommandList.M_DAT_TalismanList,
            CommandList.M_DAT_Change_Money,
        ]);
    }

    /**
     * 在这里书写所有需要订阅的消息
     */
    public listNotificationInterests(): Array<any> {
        //2、订阅界面事件
        return [CommandList.M_CMD_UiOpened_Talisman];
    }

    /**
     * 在这里处理所有订阅的界面事件
     */
    public handleNotification(notification: puremvc.INotification): void {
        switch (notification.getName()) {
            case CommandList.M_CMD_UiOpened_Talisman:
                FacadeApp.fetchData([CommandList.M_NET_TalismanNum, "&oper=1"], [data => {
                    if(data[`code`]==FacadeApp.SuccessCode){
                        FacadeApp.dispatchAction(CommandList.M_DAT_TalismanList, data['data']);
                    }else{
                        UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
                    }
                }]);
                FacadeApp.dispatchAction(CommandList.M_DAT_TalismanList);
                FacadeApp.dispatchAction(CommandList.M_AT_STATUS_Power);
                FacadeApp.dispatchAction(CommandList.M_DAT_Status_PowerClick);
                if(FacadeApp.read(CommandList.Re_Status).guideId == 2) GuideWindow.inst(GuideWindow).GuideFinish(FacadeApp.read(CommandList.Re_Status).guideId);//新手引导第2步
                break;
        }
    }

    /**
     * 返回关联的UI单元
     */
    public get page(): TalismanWindow {
        return <TalismanWindow><any>(this.viewComponent);
    }
}
