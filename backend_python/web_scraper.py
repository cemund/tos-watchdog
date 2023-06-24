from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager

options = webdriver.ChromeOptions()
options.add_argument('--headless')
driver=webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

#driver.get("https://policies.google.com/terms?hl=en-US")
#html = driver.page_source
#element = driver.find_element(By.TAG_NAME,"Body")
#print(element.text)

def scrape(website):
    driver.get(website)
    #html = driver.page_source
    element = driver.find_element(By.TAG_NAME, "Body")
    
    #replacedApostrophe = (element.text).replace('’', '\'')
    #print(element.text)
    splitElement = (element.text).split('\n')
    print(splitElement)
    #return element.text
    
    return splitElement

#tos = scrape("https://policies.google.com/terms?hl=en-US")
#print(type(tos))