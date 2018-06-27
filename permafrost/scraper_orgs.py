import scrapy
import json

### Run 'scrapy runspider scraper_orgs.py -o orgs_infos.json' in console to export results in json

class MySpider(scrapy.Spider):
    name = "gtnp_org"
    organizations = []
    start_urls = []
    with open('orgs.json') as f:
        orgs = json.load(f)
        for org in orgs:
            organizations += org['name']
            start_urls += org['url']

    # print(start_urls)

    def start_requests(self):
        for url in self.start_urls:
            if 'gtnpdatabase' in url:
                yield scrapy.Request(url = url, callback=self.info_org)

    def info_org(self,response):
        self.orga = response.xpath('//*[@id="formHeader"]/h1/text()').extract()[0]
        self.table = response.xpath('//*[@class="infoTable"]')[1]
        self.rows = self.table.xpath('tr')
        self.address = 'None'
        self.zipcode = 'None'
        self.city = 'None'
        self.country = 'None'
        self.website = 'None'

        for row in self.rows:
            field = row.xpath('td')
            if 'Address' in field[0].xpath('text()').extract()[0]:
                self.address = field[1].xpath('text()').extract()[0]
            elif 'Zipcode' in field[0].xpath('text()').extract()[0]:
                self.zipcode = field[1].xpath('text()').extract()[0]
            elif 'City' in field[0].xpath('text()').extract()[0]:
                self.city = field[1].xpath('text()').extract()[0]
            elif 'Country' in field[0].xpath('text()').extract()[0]:
                self.country = field[1].xpath('text()').extract()[0]
            elif 'Website' in field[0].xpath('text()').extract()[0]:
                self.website = field[1].xpath('a/@href').extract()[0]

        # yield {
        #     'organization' : self.orga,
        #     'address': self.address,
        #     'zipcode': self.zipcode,
        #     'city' : self.city,
        #     'country' : self.country,
        #     'website' : self.website,
        # }
        yield {
            self.orga : {
                'address': self.address,
                'zipcode': self.zipcode,
                'city': self.city,
                'country': self.country,
                'website': self.website,
            }
        }
