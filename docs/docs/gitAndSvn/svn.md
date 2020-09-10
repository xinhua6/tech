# svn
多数的svn操作可以参考链接，这里仅作补充。  
### 代码冲突
场景假设：你与同事同时对同一个文件的同一行代码做了修改，同事先于你提交，即你的本地版本低于线上版本，此时你提交该文件产生冲突。  

解决方法：
1. 放弃自己的更新，使用svn revert(回滚)，然后提交。在这种方式下不需要使用svn resolved(解决)
2. 放弃自己的更新，使用别人的更新。使用最新获取的版本覆盖目标文件，执行resolved filename并提交(选择文件—右键—解决)。
3. 手动解决，然后执行resolved filename来解除冲突，最后提交。

针对手动解决执行步骤如下：  
1. 选中冲突文件右键，选择TortoiseSVN—Edit conflicts(解决冲突)，出现窗口共三个，分别是：  
Theirs窗口为服务器上当前最新版本  
Mine窗口为本地修改后的版本  
Merged窗口为合并后的文件内容显示  
2. 修改冲突部分，或者鼠标右键，选择Use this text block(使用这段文本块)，然后保存
3. 选中文件--右键菜单—TortoiseSVN—Resolved(解决)。会列出冲突的文件列表，如果确认已经解决，点OK。


### 参考
[TortoiseSVN新人使用指南](https://blog.csdn.net/maplejaw_/article/details/52874348)
