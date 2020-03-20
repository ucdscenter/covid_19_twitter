import os
import twitter
import pandas
import json
from TwitterSearch import *
import sys
from credentials import consumer_key, consumer_secret, access_token, access_secret


class getTweets:
	def __init__(self, hashtag=None, hashtags=None, username=None, usernames=None):
		self.hashtag = hashtag
		self.hashtags = hashtags
		self.username=username
		self.usernames=usernames
		self.results = []
		self.api = twitter.Api(consumer_key=consumer_key,
				  consumer_secret=consumer_secret,
				  access_token_key=access_token,
				  access_token_secret=access_secret,
				  sleep_on_rate_limit=True)

	def get_hashtag_tweets(self, max_count=1000):
		min_id = 9999999999999999999
		results = self.api.GetSearch(raw_query="q=" + self.hashtag +"%20&result_type=recent&since=2019-01-01&count=100")
		for x in results:
			if x._json["id"] < min_id:
				min_id = x._json["id"]
			self.results.append(x._json)
		print(len(self.results))

		while len(self.results) < max_count:
			print(len(self.results))
			results = self.api.GetSearch(raw_query="q=" + self.hashtag +"%20&result_type=recent&since=2019-01-01&count=100&max_id=" + str(min_id))
			for x in results:
				if x._json["id"] < min_id:
					min_id = x._json["id"]
				self.results.append(x._json)
	
			if len(results) == 1:
				print("final")
				print(len(self.results))
				break

	def dump_results(self,fname):
		f = open(fname, 'w')
		json.dump(self.results, f, indent=4)



if __name__ == "__main__":
	hashtag = sys.argv[1]
	d = getTweets(hashtag=hashtag)
	d.get_hashtag_tweets(max_count=10000)
	d.dump_results(hashtag + ".json")




