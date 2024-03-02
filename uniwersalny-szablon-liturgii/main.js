function toggleDisable(checkbox, fieldset) {
    var toggle = document.getElementById(fieldset);
    checkbox.checked ? toggle.disabled = false : toggle.disabled = true;
}

//todo: save the checkboxes state

class VisibilityOfClasses
{
    //list of classes
    m_classes = new Map();

    //TODO: optimize this
    m_refreshVisibility() //of elements with special classes
    {
        for (const [classOf, enabled] of this.m_classes)
        {
            var classElements = document.getElementsByClassName(classOf);
            for (let i = 0; i < classElements.length; i++)
            {
                if(enabled) {
                    classElements[i].style.removeProperty( 'display' );
                } else {
                    classElements[i].style.display = "none";
                }
            }
        }

        for (const [classOf, enabled] of this.m_classes) //exclude not-if-
        {
            var classElements = document.getElementsByClassName("not-if-"+classOf);
            for (let i = 0; i < classElements.length; i++)
            {
                if(enabled) {
                    classElements[i].style.display = "none";
                }
            }
        }
    }

    constructor()
    {
        //classes made by serching for inputs,  with class="visibility-changer"
        //TODO: catch error if found is not input
        var classes = document.getElementsByClassName("visibility-changer");
        for (let i=0; i < classes.length; i++)
        {
            this.m_classes.set(classes[i].getAttribute("value"), classes[i].checked);
        }
        //console.log(this.m_classes);
        this.m_refreshVisibility();
    }

    m_setVisibility(className, enabled)
    {
        this.m_classes.set(className, enabled);
        this.m_refreshVisibility();
    }
}


//usage of class

visibilityOfClasses = null;

function initializeVisibility()
{
    visibilityOfClasses = new VisibilityOfClasses();
}

function changeVisibility(elem) //value attribute must be addded!
{
    visibilityOfClasses.m_setVisibility(elem.getAttribute("value"), elem.checked);
}