import scrapy
from scrapy.crawler import CrawlerProcess

class MySpider(scrapy.Spider):
    name = "gtnp_org"
    start_urls = ['https://gtnp.arcticportal.org/about-the-gtnp/organizations']
    allowed_domains = ["gtnpdatabase.org"]

    def start_requests(self):
        for url in self.start_urls:
            yield scrapy.Request(url = url, callback=self.get_org)

    def get_org(self, response):
        table = response.xpath('//*[@id="top_content"]//table//tbody')
        rows = table.xpath('tr')
        for index,row in enumerate(rows):
            if index%2 == 1:
                for orga in row.xpath('td//a'):
                    yield {
                        'name': orga.xpath('text()').extract(),
                        'url': orga.xpath('@href').extract(),
                    }

#### run in console to get json : scrapy runspider scraper_gtnp.py -o orgs.json


# process = CrawlerProcess()
# process.crawl(MySpider)
# process.start()