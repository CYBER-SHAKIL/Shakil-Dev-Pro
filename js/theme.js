// ---------------- COLOR CHANGE ----------------  
function changeColor(color){  
    document.documentElement.style.setProperty('--glow-color', color);  
    const hex = color.replace('#', '');
    if (/^[0-9a-f]{6}$/i.test(hex)) {
        const rgb = [0, 2, 4].map(index => parseInt(hex.slice(index, index + 2), 16)).join(', ');
        document.documentElement.style.setProperty('--glow-rgb', rgb);
    }

    // থ্রি.জেএস ব্যাকগ্রাউন্ডের রং পরিবর্তন
    if (window.threeSceneMaterial) {
        window.threeSceneMaterial.color.set(color);
    }

    document.querySelectorAll('.card').forEach(card=>{  
        card.style.boxShadow = `0 0 15px ${color}`;  
    });  

    document.querySelectorAll('.float-btns div').forEach(btn=>{  
        btn.style.boxShadow = `0 6px 14px rgba(0,0,0,0.45), 0 0 16px ${color}`;  
    });  

    document.querySelectorAll('.thumbnail-wrapper').forEach(thumb=>{  
        thumb.style.boxShadow = `0 0 5px ${color}`;  
    });  

    document.querySelectorAll('.play-icon').forEach(icon=>{  
        icon.style.color = color;  
        icon.style.boxShadow = `0 0 5px ${color}`;  
    });  

    document.querySelectorAll('.video-wrapper').forEach(wrapper=>{  
        wrapper.style.boxShadow = `0 0 10px ${color}`;  
    });  

    document.querySelectorAll('.controls button').forEach(btn=>{  
        btn.style.background = color;  
    });  

    document.querySelectorAll('.info').forEach(info=>{  
        info.style.color = color;  
    });  

    document.querySelectorAll('.back-button').forEach(btn=>{  
        btn.style.color = color;  
        btn.style.boxShadow = `0 0 5px ${color}`;  
    });  

    document.querySelectorAll('.toast').forEach(toast=>{  
        toast.style.background = color;  
    });  

    document.querySelectorAll('.info-section h2').forEach(h2=>{  
        h2.style.color = color;  
        h2.style.textShadow = `0 0 15px ${color}`;  
    });  

    document.querySelectorAll('.info-content').forEach(content=>{  
        content.style.boxShadow = `0 0 20px ${color}`;  
    });  

    document.querySelectorAll('.device-info-item').forEach(item=>{  
        item.style.boxShadow = `0 0 10px ${color}`;  
    });  

    document.querySelectorAll('.device-info-item h3').forEach(h3=>{  
        h3.style.color = color;  
    });  
}
