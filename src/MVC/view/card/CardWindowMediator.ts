/**
 * 和舞台对应的Mediator
 */
class CardWindowMediator extends puremvc.Mediator implements puremvc.IMediator {
    /**
     * 和指定UI建立关联，为UI上的控件订阅界面事件，并提供对应的响应函数
     */
    public constructor(viewComponent: any) {
        super(ViewerName.CardWindowMediator, viewComponent);
        this.RegisterDataSource();
    }

    /**
     * 订阅和数据仓库相关的事件，当数据更新时自动刷新界面
     */
    public RegisterDataSource(){
        this.page.RegisterDataSource([
            CommandList.M_DAT_CardList,
        ]); 
    }

    /**
     * 在这里书写所有需要订阅的消息
     */
    public listNotificationInterests(): Array<any> {
        return [CommandList.M_CMD_UiOpened_Card];
    }

    /**
     * 在这里处理所有订阅的消息
     */
    public handleNotification(notification: puremvc.INotification): void {
        switch (notification.getName()) {
            case CommandList.M_CMD_UiOpened_Card:
                FacadeApp.fetchData([CommandList.M_NET_Card, "&oper=1"], [data => {
                    //将网络数据保存到数据仓库，自动触发数据更新
                    // console.log(data['data'])
                    FacadeApp.dispatchAction(CommandList.M_DAT_CardList, data['data']);
                    if(data[`code`]==FacadeApp.SuccessCode){

                    }else{
                        UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
                    }
                }]);
                break;
        }
    }

    /**
     * 返回关联的UI单元
     */
    public get page(): CardWindow {
        return <CardWindow><any>(this.viewComponent);
    }
}
