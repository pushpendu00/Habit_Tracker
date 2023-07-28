const add_button = document.getElementById('add-button');
const input_habits = document.getElementById('input-habits');


// weekly views show and hiede
function showWeeklyViews(event){
    let id = event.target.parentNode.parentNode.parentNode.id;
    let view = document.getElementById(`views-${id}`);
    let val = window.getComputedStyle( view ,null).getPropertyValue('display');
    if(val === "none"){
        view.style.display = 'block';
        view.style.display = 'flex';
        // console.log("is statement");
    }else{
        // console.log("else statement");
        view.style.display = 'none';
    }
}



// change every days status
async function changeStatus(event){
    var id = event.target.parentNode.parentNode.parentNode.id;
    await fetch(`/${id}/status`,{
        method : "PUT"
    }).then(()=>{
        console.log("update done");
    }).catch((err)=>{
        console.log(err);
    });
    return window.location.href = "/";
}



// delete habits
async function deleteHabits(event){
    var id = event.target.parentNode.parentNode.parentNode.id;
    // console.log('id = ',id);
    let con = confirm("Are you want to delete this habits....??");
    if(con == true)
    {
        await fetch(`/${id}/delete`,{
            method : "DELETE"
        }).then(()=>{
            console.log("delete successfully");
        }).catch((e)=>{
            console.log(e);
        });
        console.log("Habits is deleted");
        // alert('gffhgvk');
        return window.location.href = "/";
    }
    console.log('not deleted');
}