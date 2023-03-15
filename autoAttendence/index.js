const {Builder, By, Key, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome'); 
const { titleIs } = require('selenium-webdriver/lib/until');

const id = "jinjjij0226";
const pw = "jin@0226";

const dict = {};

dict["논리설계"] = "Self";
dict["신호및시스템"] = "출석하기";
dict["인공지능"] = "출석하기";
dict["인터넷프로토콜"] = "출석하기";


const run = async () => {
	// headless로 크롬 드라이버 실행
    let driver = await new Builder()
    .forBrowser('chrome')    
    //.setChromeOptions(new chrome.Options().headless().addArguments("--disable-gpu", "window-size=1920x1080",
    //"lang=ko_KR"))
    .build();

    // 특정 URL 생성
    await driver.get('https://kulms.korea.ac.kr/');


    try {
        // 로그인창까지 접속
        console.log("<블랙보드 로그인> 클릭");

        element = await driver.findElement(By.xpath("/html/body/div[2]/div/div/section/div/div/div/div[1]/div/div[2]/h3/strong/a"));
        driver.executeScript("arguments[0].click()", element);

        console.log("id, pw 입력");
        console.log(await driver.getTitle());
        if(await driver.getTitle() === "Korea University SAML Login"){
            console.log("로그인창 접속 성공!");
            // 성공
        }else{
            console.log("로그인창 접속 실패! >> 종료");
            // 실패
            return;
        }

        let idInput = await driver.findElement(By.name("one_id"));
        let pwInput = await driver.findElement(By.name("user_password"));
        
        await idInput.sendKeys(id);
        await pwInput.sendKeys(pw, Key.RETURN);


        // "코스" 버튼 누르기
        await driver.wait(until.elementLocated(By.xpath("/html/body/div[1]/div[2]/bb-base-layout/div/aside/div[1]/nav/ul/bb-base-navigation-button[4]/div/li/a")), 5 * 1000).then(el => {
            el.click();
        });

        for(var key in dict){
            // 각 코스 클릭
            console.log("각 코스 클릭");
            await driver.wait(until.elementLocated(By.partialLinkText(key)), 5 * 1000).then(el => {
                el.click();
            }); 


            // 프레임 전환
            await driver.wait(until.elementLocated(By.name("classic-learn-iframe")), 5 * 1000).then(el =>{
                driver.switchTo().frame(el);
            })
            let currentFrame = await driver.executeScript("return self.name");
            console.log("This is the name of the frame we've accessed " + currentFrame);


            // 출석하기 메뉴 버튼 클릭
            await driver.wait(until.elementLocated(By.partialLinkText(dict[key])), 5 * 1000).then(el => {
                el.click();
            });

            // 출석버튼이 있다면 버튼 누르기


            // 프레임 원상복구
            await driver.switchTo().defaultContent();


            // 뒤로가기 버튼
            await driver.wait(until.elementLocated(By.className("bb-close")), 5 * 1000).then(el => {
                el.click();
            });
        }
        
        
        
        
    } catch (error) {
        console.log(error);
    }

    console.log(await driver.getTitle());
}
run();