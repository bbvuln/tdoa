/*
 * JsMin
 * Javascript Compressor
 * http://www.crockford.com/
 * http://www.smallsharptools.com/
 *
 * shBrushAsp.js
 * http://zmzm.myfootprints.cn
 * myfootprints.cn@gmail.com
*/

dp.sh.Brushes.Asp=function() {
    var keywords = 'AddHandler AddressOf AndAlso Alias And Ansi As Assembly Auto ' + 
                    'Boolean ByRef Byte ByVal Call Case Catch CBool CByte CChar CDate ' + 
                    'CDec CDbl Char CInt Class CLng CObj Const CShort CSng CStr CType ' + 
                    'Date Decimal Declare Default Delegate Dim DirectCast Do Double Each ' +
                    'Else ElseIf End Enum Erase Error Event Exit False Finally For Friend ' + 
                    'Function Get GetType GoSub GoTo Handles If Implements Imports In ' + 
                    'Inherits Integer Interface Is Let Lib Like Long Loop Me Mod Module ' + 
                    'MustInherit MustOverride MyBase MyClass Namespace New Next Not Nothing ' + 
                    'NotInheritable NotOverridable Object On Option Optional Or OrElse ' +
                    'Overloads Overridable Overrides ParamArray Preserve Private Property ' +
                    'Protected Public RaiseEvent ReadOnly ReDim REM RemoveHandler Resume ' + 
                    'Return Select Set Shadows Shared Short Single Static Step Stop String ' +
                    'Structure Sub SyncLock Then Throw To True Try TypeOf Unicode Until ' + 
                    'Variant When While With WithEvents WriteOnly Xor';
    //var quotes = 'CDB';
    this.regexList = [{regex:new RegExp('\'.*$','gm'),css:'comment'},
                        {regex:dp.sh.RegexLib.DoubleQuotedString,css:'string'},
                        {regex:new RegExp('^\\s*#.*','gm'),css:'preprocessor'},
                        {regex:new RegExp(this.GetKeywords(keywords),'gm'),css:'keyword'}, 
                        {regex:new RegExp('(\&lt;|<)%','gm'),css:'quote'}, 
                        {regex:new RegExp('%(\&gt;|>)','gm'),css:'quote'}
                    ];
    this.CssClass = 'dp-asp';
}
dp.sh.Brushes.Asp.prototype = new dp.sh.Highlighter();
dp.sh.Brushes.Asp.Aliases = ['asp','asp.net'];
