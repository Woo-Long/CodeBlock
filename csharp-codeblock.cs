1. // sql in查询处理（例如：字符串1,2处理成1','2）
IN('" + System.Text.RegularExpressions.Regex.Replace(removeBerth, "\\,", "','") + "');
// =====================================================================================
2. //C#字符串单个拆分
string str="OM9";
var arr=str.ToCharArray();
for(var i=0;i<arr.Length;i++){
 Console.WriteLine(arr[i]);
}
// =====================================================================================
