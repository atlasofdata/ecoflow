import scrapy
import json
import pandas as pd

### Run 'scrapy runspider scraper_orgs.py -o orgs_infos.json' in console to export results in json
### Run 'scrapy runspider scraper_orgs.py -o orgs_infos.csv' in console to export results in csv

class MySpider(scrapy.Spider):
    name = "gtnp_people"
    organizations = []
    base_url = "http://gtnpdatabase.org/contacts/view/"
    start_urls = []

    def create_url(self):
        s_calm = pd.read_csv("../stations_calm.csv")
        s_bore = pd.read_csv("../stations_boreholes.csv")

        id_people1 = list(s_calm['responsible_person'])
        id_people2 = list(s_bore['responsible_person'])

        id_people = set(id_people1 + id_people2)

        for id in id_people:
            self.start_urls += [self.base_url + str(id)]

    def start_requests(self):
        self.create_url()
        for url in self.start_urls:
                yield scrapy.Request(url = url, callback=self.info_people)

    def info_people(self,response):
        self.orga =  response.xpath('//*[@class="infoTable"]')[0].xpath('tr/td/a/@title').extract()[0]
        self.id = str(response).split("/")[-1][:-1]

        ##for json
        # yield {
        #     self.id : self.orga
        # }

        ##for csv
        yield {
            'id' : self.id,
            'orga': self.orga,
        }





MySpider()