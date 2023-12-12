var def_app = 'gpt';

$('#start_q').click(function() {
    let q = $('#q_input').val();
    if (q.length > 0) {
        if ($('.text_main_block .present h2').text() == `- поможет`) {
            $('.text_main_block').html('')
            $('.loader_block').html('<span class="loader"><img src="./fav/stul.png"></span>');
        } else {
            $('.loader_block').html('<span class="loader"><img src=" ./fav/stul.png"></span>');
            $('.loader').css('display', 'flex');
        }
        let sms_block = document.createElement('div');
        sms_block.className = 'sms_block';
        sms_block.innerHTML = `<div class="ava"><img src="./fav/anon.png" alt="stul icon"><p>anon</p></div><p class="sms">${q}</p>`;
        $(`.text_main_block`).animate({
            scrollTop: $(`.text_main_block`).prop("scrollHeight")
        }, 500);
        $('.text_main_block').append(sms_block);
        $('#q_input').val('');
        $('#start_q').attr('disabled', 'disabled');
        if (def_app == 'midj') {
            try {
                $.ajax({
                    url: "./create_img/",
                    method: "post",
                    dataType: 'json',
                    data: {
                        "message": q
                    },
                    success: function(data) {
                        load_chat(data, q);
                    },
                    error: function(data) {
                        load_chat(data, q);
                    }
                });
            } catch (error) {
                console.error(error);
            }
        } else if (localStorage.chatid == undefined && def_app == 'gpt') {
            try {
                $.ajax({
                    url: "./create/",
                    method: "post",
                    dataType: 'json',
                    data: {
                        "message": q
                    },
                    success: function(data) {
                        load_chat(data, q);
                    },
                    error: function(data) {
                        load_chat(data, q);
                    }
                });
            } catch (error) {
                console.error(error);
            }
        } else if (def_app == 'gpt') {
            try {
                $.ajax({
                    url: "./send/",
                    method: "post",
                    dataType: 'json',
                    data: {
                        "message": q,
                        "chatid": localStorage.chatid,
                    },
                    success: function(data) {
                        load_chat(data, q);
                    },
                    error: function(data) {
                        load_chat(data, q);
                    }
                });
            } catch (error) {
                console.error(error);
            }
        }
    }
});

function load_chat(data, q) {
    if (data.method == 'create' || data.method == 'chat') {
        let otvet_block = document.createElement('div');
        otvet_block.className = 'sms_block';
        otvet_block.innerHTML = `<div class="ava"><img src="./fav/favicon-16x16.png" alt="stul icon"><p>stulai</p></div><div class="sms">${smsformate(data.message)}</div>`;
        console.log(data.message);
        $('.loader').css('display', 'none');
        let id = data.chatCode;
        if (localStorage.chatid == undefined || localStorage.chatid !== id) {
            localStorage.chatid = id;
        }
        if (localStorage.chats === undefined) {
            localStorage.chats = JSON.stringify([
                [`${id}`, [`${q}`, `${data.message}`]]
            ]);
        } else {
            var check = 0;
            let db = JSON.parse(localStorage.chats);
            db.forEach(item => {
                if (localStorage.chatid === item[0]) {
                    item[1].push(q);
                    item[1].push(data.message);
                    localStorage.chats = JSON.stringify(db)
                    check = 1;
                }
            });
            if (check == 0) {
                db.push([`${id}`, [`${q}`, `${data.message}`]])
                localStorage.chats = JSON.stringify(db)
            }
        }
        $('.id').html(`id:&nbsp;${localStorage.chatid}`);
        $('.text_main_block').append(otvet_block);
        code_after_load();
        load_chatlist('no');
    } else if (def_app == 'midj') {
        if (data.image_base64 == undefined) {
            var src = './fav/error.png';
        } else {
            var src = `data:image/png;base64,${data.image_base64}`;
        }
        let otvet_block = document.createElement('div');
        otvet_block.className = 'sms_block';
        otvet_block.innerHTML = `<div class="ava"><img src="./fav/favicon-16x16.png" alt="stul icon"><p>stulai</p></div><div class="sms sms_midj"><img class="midj_img" src="${src}" alt="stul"></div>`;
        if (localStorage.midjs === undefined) {
            localStorage.midjs = JSON.stringify([
                `${q}`, `${data.image_base64}`
            ]);
        } else {
            let db = JSON.parse(localStorage.midjs);
            db.push(`${q}`, `${data.image_base64}`)
            try {
                localStorage.midjs = JSON.stringify(db)
            } catch (error) {
                $('.loader').css('display', 'none');
                if (confirm('память кончилась. последнее фото не сохранится\nочистить чат ? (безвозвратно)')) {
                    localStorage.removeItem('midjs');
                    load_mdj();
                }
            }
        }
        $('.loader').css('display', 'none');
        $('.text_main_block').append(otvet_block);
        show_photo();
    } else {
        chaterror('проблемы с серваком, пока не ворк')
    }
    $('#start_q').removeAttr('disabled');
    $(`.text_main_block`).animate({
        scrollTop: $(`.text_main_block`).prop("scrollHeight")
    }, 500);
}

load_chatlist()

function load_chatlist(chatload) {
    if (localStorage.chats !== undefined && localStorage.chats !== "[]") {
        $('.chats_list').html('')
        JSON.parse(localStorage.chats).forEach(item => {
            if (chatload != 'no') {
                load_save_chat(item, localStorage.chatid);
            }
            let id = item[0];
            let f_sms = item[1][0];
            let chat = document.createElement('div');
            var chat_class = "chat";
            if (id == localStorage.chatid) {
                chat_class = "chat active";
            }
            chat.className = chat_class;
            chat.innerHTML = `<p class="chat_name" data-id="${id}">${f_sms}<br><span>id:&nbsp;${id}</span></p> <div class="delet_chat" data-id="${id}"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"></path>
            </svg></div>`;
            $('.chats_list').append(chat)
        });
        let btns_chat_list = document.createElement('div');
        btns_chat_list.className = 'btns_chat_list';
        btns_chat_list.innerHTML = `<button class="btn btn-outline-danger btn_clear btn-sm"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"></path>
        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"></path>
        </svg>удалить чаты</button>`;
        $('.delet_chat').click(function() {
            let id = $(this).attr('data-id');
            if (confirm(`точно удалить чат ? \nid:&nbsp;${id}`)) {
                let bd = JSON.parse(localStorage.chats);
                let newbd = [];
                bd.forEach(element => {
                    if (element[0] !== id) {
                        newbd.push(element);
                    }
                });
                localStorage.chats = JSON.stringify(newbd);
                if (id == localStorage.chatid) {
                    localStorage.removeItem('chatid');
                    $('.text_main_block').html(`<div class="present">
                    <img src="./fav/favicon.ico" alt="stul">
                    <h2>- поможет</h2>
                    </div><p>сайт в бете, по проблемам пишите </p>`);
                    $('.id').html('id: -');
                    load_chatlist();
                } else {
                    load_chatlist('no');
                }
            }
        });
        $('.chats_list').append(btns_chat_list)
        $('.btn_clear').click(function() {
            if (confirm('точно удалить ВСЕ чаты ?')) {
                localStorage.removeItem('chats');
                localStorage.removeItem('chatid');
                $('.text_main_block').html(`<div class="present">
                <img src="./fav/favicon.ico" alt="stul">
                <h2>- поможет</h2>
                </div><p>сайт в бете, по проблемам пишите </p>`);
                load_chatlist('no');
                $('#q_input').focus();
            }
        });
        $('.chat_name').click(function() {
            let id = $(this).attr('data-id');
            $('.chat').removeClass('active');
            $($(this).parent()).addClass('active');
            open_chat(id);
        });
    } else {
        $('.chats_list').html(`<p class="no_chats">чатов нету <br> пиши stul'y AI</p>`)
    }
}

function smsformate(input) {
    var count = 0;
    var result = input.replace(/```/g, function(match) {
        count++;
        let code = generateCode();
        return count % 2 === 0 ? '</xmp>' : `<div class="top_xmp"><p class="code_name" id="cn${code}"></p><p data-id="${code}" class="copy_code">📄 copy</p></div><xmp class="xmp_code" id="${code}">`;
    });
    count = 0;
    result = result.replace(/`/g, function(match) {
        count++;
        return count % 2 === 0 ? '</xmp></b>' : '<b><xmp style="display: inline;">';
    });
    return result;
}

function load_save_chat(item, chatid) {
    if (chatid === item[0]) {
        if ($('.text_main_block .present h2').text() == `- поможет`) {
            $('.text_main_block').html('')
        }
        item[1].forEach(function(element, index) {
            if ((index + 1) % 2 === 0) {
                let otvet_block = document.createElement('div');
                otvet_block.className = 'sms_block';
                otvet_block.innerHTML = `<div class="ava"><img src="./fav/favicon-16x16.png" alt="stul icon"><p>stulai</p></div><div class="sms">${smsformate(element)}</div>`;
                $('.text_main_block').append(otvet_block);
            } else {
                let sms_block = document.createElement('div');
                sms_block.className = 'sms_block';
                sms_block.innerHTML = `<div class="ava"><img src="./fav/anon.png" alt="stul icon"><p>anon</p></div><p class="sms">${element}</p>`;
                $('.text_main_block').append(sms_block)
            }
        });
        code_after_load();
        $('.id').html(`id:&nbsp;${chatid}`);
        localStorage.chatid = chatid;
        $(`.text_main_block`).animate({
            scrollTop: $(`.text_main_block`).prop("scrollHeight")
        }, 500);
    }
}

function open_chat(chatid) {
    $('.text_main_block').html('');
    if (localStorage.chats !== undefined) {
        JSON.parse(localStorage.chats).forEach(item => {
            load_save_chat(item, chatid);
        });
    }
}

function load_mdj() {
    if (localStorage.midjs !== undefined && localStorage.midjs !== "[]") {
        $('.text_main_block').html('');
        let db = JSON.parse(localStorage.midjs);
        db.forEach(function(element, index) {
            if ((index + 1) % 2 === 0) {
                if (element == 'undefined') {
                    var src = './fav/error.png';
                } else {
                    var src = `data:image/png;base64,${element}`;
                }
                let otvet_block = document.createElement('div');
                otvet_block.className = 'sms_block';
                otvet_block.innerHTML = `<div class="ava"><img src="./fav/favicon-16x16.png" alt="stul icon"><p>stulai</p></div><div class="sms sms_midj"><img class="midj_img" src="${src}" alt="stul"></div>`;
                $('.text_main_block').append(otvet_block);
            } else {
                let sms_block = document.createElement('div');
                sms_block.className = 'sms_block';
                sms_block.innerHTML = `<div class="ava"><img src="./fav/anon.png" alt="stul icon"><p>anon</p></div><p class="sms">${element}</p>`;
                $('.text_main_block').append(sms_block)
            }
        });
        $(`.text_main_block`).animate({
            scrollTop: $(`.text_main_block`).prop("scrollHeight")
        }, 500);
        show_photo();
    } else {
        $('.text_main_block').html(`<div class="present">
        <img src="./fav/favicon.ico" alt="stul">
        <h2>- поможет</h2>
        </div><p>сайт в бете, картинки может не генерить</p>`);
    }
}

function show_photo() {
    $('.midj_img').click(function() {
        let src = $(this).attr('src');
        if (src != './fav/error.png') {
            $('.show-photo-bg').removeClass('none');
            $('.show-photo').removeClass('none');
            $('.show-photo img').attr('src', src);
        }
    });
    $('.show-photo-bg').click(function() {
        $('.show-photo-bg').addClass('none');
        $('.show-photo').addClass('none');
    });
}

setInterval(() => {
    let q = $('#q_input').val();
    if (q.length == 0) {
        $('#start_q').attr('disabled', 'disabled');
    } else {
        $('#start_q').removeAttr('disabled');
    }
}, 100);

$(document).ready(function() {
    if (localStorage.save_app == 'midj') {
        def_app = 'midj';
        $('#ai_chose').prop('checked', false);
        $('.ai').html('midjourney / долго / english');
        $('.stul').html('');
        $('.id').html('');
        $('.chat_list_btn').attr('disabled', 'disabled');
        $('.dropleft .btn-success').attr('disabled', 'disabled');
        $('#q_input').focus();
        $('.toggle').addClass('off btn-danger');
        $('.toggle').removeClass('btn-primary');
        let clear_btn = document.createElement('div');
        clear_btn.className = 'btn btn-primary';
        clear_btn.setAttribute('id', 'delet');
        clear_btn.innerHTML = '🗑️';
        $('.main_input').prepend(clear_btn);
        $('#delet').click(function() {
            if (confirm("удалить чат с midjourney ? картинки не вернуть")) {
                localStorage.removeItem('midjs')
                load_mdj();
            }
        });
        load_mdj();
    }
});

function toggleAI() {
    if ($('#ai_chose:checked').val() == undefined) {
        def_app = 'gpt';
        localStorage.save_app = 'gpt';
        $('#delet').remove();
        $('.ai').html('chatGPT');
        $('.stul').html('&ensp;|&ensp;');
        $('.text_main_block').html(`<div class="present">
        <img src="./fav/favicon.ico" alt="stul">
        <h2>- поможет</h2>
        </div><p>сайт в бете, по проблемам пишите </p>`);
        $('.id').html('id: -');
        $('.chat_list_btn').removeAttr('disabled');
        $('.dropleft .btn-success').removeAttr('disabled');
        $('#q_input').focus();
        load_chatlist();
    } else {
        def_app = 'midj';
        localStorage.save_app = 'midj';
        $('.ai').html('midjourney / долго / english');
        $('.stul').html('');
        $('.id').html('');
        $('.chat_list_btn').attr('disabled', 'disabled');
        $('.dropleft .btn-success').attr('disabled', 'disabled');
        $('#q_input').focus();
        load_mdj();
        let clear_btn = document.createElement('div');
        clear_btn.className = 'btn btn-primary';
        clear_btn.setAttribute('id', 'delet');
        clear_btn.innerHTML = '🗑️';
        $('.main_input').prepend(clear_btn);
        $('#delet').click(function() {
            if (confirm("удалить чат с midjourney ? картинки не вернуть")) {
                localStorage.removeItem('midjs')
                load_mdj();
            }
        });
    }
}

function copyText(text) {
    var textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
}

function generateCode() {
    let code = '';
    const digits = '0123456789';
    for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * digits.length);
        code += digits[randomIndex];
    }
    return code;
}

function code_after_load() {
    let xmps = document.querySelectorAll('xmp');
    xmps.forEach(function(xmp) {
        let code = xmp.textContent;
        let words = code.split('\n');
        let leng = words.shift();
        let newcode = words.join('\n');
        xmp.textContent = newcode;
        if (leng === 'html' || leng === 'css' || leng === 'csharp' || leng === 'cpp' || leng === 'javascript' || leng === 'java' || leng === 'python' || leng === 'ruby' || leng === 'go' || leng === 'typescript' || leng === 'swift' || leng === 'kotlin' || leng === 'rust' || leng === 'matlab') {

        } else if (xmp.textContent == '') {
            xmp.textContent = leng;
            leng = 'code';
        } else {
            leng = 'code';
        }
        let id = xmp.getAttribute('id');
        $(`#cn${id}`).html(leng)
    });
    $('.copy_code').click(function() {
        let id = $(this).attr('data-id')
        copyText($(`#${id}`).text())
        $(this).html('✓ стыбзил !');
        setTimeout(() => {
            $(this).html('📄 copy')
        }, 1500);
    });
}

$('#creat_chat').click(function() {
    localStorage.removeItem('chatid');
    $('.text_main_block').html(`<div class="present">
    <img src="./fav/favicon.ico" alt="stul">
    <h2>- поможет</h2>
    </div><p>сайт в бете, по проблемам пишите </p>`);
    $('#q_input').focus();
    $('.id').html('id: -');
});

$('#q_input').keyup(function() {
    this.style.overflow = 'hidden';
    this.style.height = 0;
    this.style.height = this.scrollHeight + 'px';
})


document.querySelector('#q_input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        $('#start_q').click();
    }
});