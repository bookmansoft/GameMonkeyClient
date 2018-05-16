
/**
 * 主动技能
 */
class ActiveSkill{
    /**
     * 构造方法
     */
    public constructor(object: Object){
        this._id = parseInt(object["id"]);
        this._name = object["name"];
        this._icon = object["iconRes"];
        var effcet: string[] = (<string>(object["effectId"])).split(":");
        this._skillEffectID = parseInt(effcet[0]);
        if (effcet.length > 1){
            this._effectNum = parseFloat(effcet[1]);
        }
        this._description = object["desc"];
        this._duration = parseInt(object["duration"]);
        this._coolTime = parseInt(object["cooldown"]);
        this._lastTime = 0;
    }

    /**
     * ID
     */
    public get ID(): number{
        return this._id;
    }

    /**
     * 名字
     */
    public get Name(): string{
        return this._name;
    }

    /**
     * 图标
     */
    public get Icon(): string{
        return this._icon;
    }

    /**
     * 描述ID
     */
    public get Description(): string{
        return this._description;
    }

    /**
     * 效果剩余时间
     */
    public set LastTime(val: number){
        this._lastTime = Math.max(0, val);
    }

    /**
     * 效果剩余时间
     */
    public get LastTime(): number{
        return this._lastTime;
    }

    /**
     * 冷却时间
     */
    public set CoolTime(val: number){
        if (val < 0) val = 0;
        this._coolTime = val;
    }

    /**
     * 冷却时间
     */
    public get CoolTime(): number{
        return this._coolTime;
    }

    /**
     * 技能状态
     */
    public set Status(val: number){
        this._status = val;
    }

    /**
     * 技能状态
     */
    public get Status(): number{
        return this._status;
    }

    /**
     * 获取当前时间进度
     */
    public GetProgress(): number{
        var pg: number = 0;
        if (this._status == SkillStatusType.Used){
            pg = this._lastTime / this._duration;
        }
        else{
            pg = this._lastTime / this.CoolTime;
        }
        return Math.min(pg, 1);
    }

    /**
     * 帧响应
     */
    public Process(time: number){
        if(this.Status == SkillStatusType.CanUse){
            return;
        }

        this._timer += time;
        if (this._timer >= 1000){
            this._timer -= 1000;

            // 技能时间更新
            if (this._lastTime > 0){
                this.LastTime -= 1;
            }

            if (this._lastTime == 0){
                this.Status = SkillStatusType.CanUse; //设置此状态，避免本地再次刷新，之后发送网络请求，由网络数据最终更新准确状态
                //技能效果到期，效果列表发生变化，此处直接请求网络刷新
                FacadeApp.fetchData([CommandList.M_NET_SkillNum, "&oper=1&aid&pm"], [data => {
                    SkillManager.UpdateStatus(data["data"]["items"]);
                    FacadeApp.dispatchAction(CommandList.M_AT_EFFECTS, data['data']['effects']);//更新效果列表
                    if (data["code"] == FacadeApp.SuccessCode){
                    }else{
                        UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
                    }
                }]);
            }
            else{
                FacadeApp.Notify(CommandList.M_CMD_SkillStatus, this.ID);
            }
        }
    }

    // 配置信息：
    private _id: number;                        // ID
    private _name: string;                      // 名字
    private _icon: string;                      // 图片
    private _skillEffectID: number;             // 技能效果ID
    private _effectNum: number;                 // 效果数值
    private _skillType: number;                 // 技能类型
    private _description: string;               // 描述
    private _duration: number;                  // 配置信息：技能的持续时间
    private _coolTime: number;                  // 配置信息：技能的冷却时间
    private _lastTime: number;                  // 效果剩余时间
    private _timer: number = 0;                 // 计时器
    public _status: number = 0;                 // 技能状态
}