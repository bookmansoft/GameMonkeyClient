/**
 * 和舞台（Main）对应的Mediator
 */
class ShopWindowMediator extends puremvc.Mediator implements puremvc.IMediator {
    /**
     * 和指定UI建立关联，为UI上的控件订阅界面事件，并提供对应的响应函数
     */
    public constructor(viewComponent: any) {
        super(ViewerName.ShopWindowMediator, viewComponent);

        this.RegisterDataSourceFun();
    }

    /**
     * 订阅数据事件
     */
    public RegisterDataSourceFun(){
        this.main.RegisterDataSource([
            CommandList.SHOP_GET_LIST,
            CommandList.M_DAT_Change_Money,
        ]);
    }

    /**
     * 在这里书写所有需要订阅的消息
     */
    public listNotificationInterests(): Array<any> {
        return [
            CommandList.M_CMD_UiOpened_Shop,
        ];
    }

    /**
     * 在这里处理所有订阅的消息
     */
    public handleNotification(notification: puremvc.INotification): void {
        switch (notification.getName()) {
            case CommandList.M_CMD_UiOpened_Shop:
                FacadeApp.fetchData([CommandList.M_NET_SHOP, "&oper=3&type=1"], [data => {
                    //将网络数据保存到数据仓库，自动触发数据更新
                    FacadeApp.dispatchAction(CommandList.SHOP_GET_LIST, data['data']['items']);
                    if(data["code"] != FacadeApp.SuccessCode) UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
                }]);
                break;
        }
    }

    /**
     * 返回关联的UI单元
     */
    public get main(): ShopWindow {
        return <ShopWindow><any>(this.viewComponent);
    }
}
