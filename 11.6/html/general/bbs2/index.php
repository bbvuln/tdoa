<?
include_once("inc/auth.inc.php");

$HTML_PAGE_TITLE = _("超级论坛");
include_once("inc/header.inc.php");
?>
<BODY class="bodycolor">

<table border="0" width="100%" cellspacing="0" cellpadding="3" class="small">
  <tr>
    <td class="Big"><img src="<?=MYOA_STATIC_SERVER?>/static/images/menu/infofind.gif" WIDTH="22" HEIGHT="20" align="absmiddle"><span class="big3"> <?=_("超级论坛")?></span>
    </td>
  </tr>
</table>

<br>

<?
Message(_("提示"),_("如需安装超级论坛，请参考：通达网站/OA知识库/Office Anywhere 高级应用技巧/OA与Discuz!论坛集成。"));
?>

</body>
</html>