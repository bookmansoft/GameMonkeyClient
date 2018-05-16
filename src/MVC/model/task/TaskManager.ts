
/**
 * 任务管理
 */
class TaskManager{
    /**
     * 初始化
     */
    public static Init(){
        TaskManager._taskSet = [];
        let data = ConfigStaticManager.getList(ConfigTypeName.Task);
        Object.keys(data).map(key => {
            let task: Task = new Task(data[key]);
            TaskManager._taskSet[task.ID] = task;
        })
        
    }

    /**
     * 获得任务列表
     */
    public static get TaskSet(): Task[]{
        return TaskManager._taskSet;
    }

    /**
     * 通过ID获得任务
     * @param id    任务ID
     */
    public static GetTaskByID(id: number): Task{
        return this._taskSet[id];
    }

    /**
     * 来自哪个任务
     */
    public static fromData(data:any): Task{
        let ret:Task = TaskManager.GetTaskByID(data.id);
        return ret;
    }

    // 变量
    private static _taskSet : Task[];
}