
//------ added 090216  ------
//处理列表扩展字段相关JS函数
function func_insert()
{
  var select1 = document.getElementById("select1");
  var select2 = document.getElementById("select2");

  for (i = select2.options.length - 1; i >= 0; i--)
  {
    if(select2.options[i].selected)
    {
      option_text = select2.options[i].text;
      option_value = select2.options[i].value;
      option_style_color = select2.options[i].style.color;

      var my_option = document.createElement("OPTION");
      my_option.text = option_text;
      my_option.value = option_value;
      my_option.style.color = option_style_color;

      select1.add(my_option);
      select2.remove(i);
    }
  }//for
}

function func_delete()
{
	var select1 = document.getElementById("select1");
  var select2 = document.getElementById("select2");

  for (i = select1.options.length-1; i >= 0; i--)
  {
    if(select1.options[i].selected)
    {
      option_text = select1.options[i].text;
      option_value = select1.options[i].value;

      var my_option = document.createElement("OPTION");
      my_option.text = option_text;
      my_option.value = option_value;

      select2.add(my_option);
      select1.remove(i);
    }
  }//for
}

function func_select_all1()
{
	var select1 = document.getElementById("select1");
  var select2 = document.getElementById("select2");

  for (i = select1.options.length - 1; i >= 0; i--)
    select1.options[i].selected = true;
}

function func_select_all2()
{
  var select1 = document.getElementById("select1");
  var select2 = document.getElementById("select2");

  for (i = select2.options.length - 1; i >= 0; i--)
    select2.options[i].selected = true;
}


