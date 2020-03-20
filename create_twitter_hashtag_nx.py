import networkx
import os
import re
import json
import csv
import sys


class Gnode:
	def __init__(self, graph_score, score, idn, followers_count, retweet_count, hashtags, text, tweet_id, name,dummy=False, group=0):
		self.graph_score = graph_score
		self.score = score
		self.idn = idn
		self.followers_count = followers_count
		self.retweet_count = retweet_count
		self.hashtags = []
		self.hgroup = []
		for h in hashtags:
			self.hashtags.append(h["text"])
		self.text = [text]

		self.tweet_ids = [tweet_id]
		self.name = name
		self.group = [group]
		
		self.dummy = dummy


	def json_print(self):
		return {
			"graph_score" : self.graph_score,
			"score" : self.score,
			"id" : self.idn,
			"followers_count" : self.followers_count,
			"retweet_count" : self.retweet_count, 
			"hashtags" : self.hashtags,
			"text" : self.text,
			"group" : self.group,
			"name" : self.name,
			"hgroup" : self.hgroup
		}


class TwitterTool():
	def __init__(self):
		self.name = "name"
		self.nodesdict = dict()
		self.linksdict = dict()
		self.hashtag_count = dict()
		self.handledicts = []
		self.tweet_graph = {
			"nodes" :[],
			"links" : []
			}

		self.tweets = []

	def _search(self, searchFor):
		
		for k in self.tweets:
			if k == searchFor:
				return k
		return -1


	def _handlegroup(self, user):
		for x in range(0, len(self.handledicts)):
			if user in self.handledicts[x]:
				return x
		return len(self.handledicts)



	def _is_dummy_node(self, t_id):
		if t_id in self.nodesdict:
			if self.nodesdict[t_id].dummy:
				return True
			else:
				return False
		return False

	def _add_link(self,source, target, ltype):
		linkkey = str(source) + "," + str(target)
		#linkkey2 = str(target) + "," + str(source)
		weight = 0
		if ltype == "mention":
			weight = float(2)
		if ltype == "quoted":
			weight = float(15)
		if ltype == "reply":
			weight = float(10)
		if ltype =="retweet":
			weight = float(5)
		if linkkey in self.linksdict:
			self.linksdict[linkkey]["value"] = 1 / ((1 / self.linksdict[linkkey]["value"]) + weight)
		#if linkkey2 in linksdict:
		#	linksdict[linkkey2]["value"] =  1 / ((1 / linksdict[linkkey2]["value"]) + weight)
		else:
			self.linksdict[linkkey] = {
			 "source" : source,
			 "target" : target,
			  "value" :  1 / weight
			}
	def _add_node(self, tweet):
		d_id = tweet["user"]["id"]
		for h in tweet["entities"]["hashtags"]:
			if h["text"] in self.hashtag_count:
				self.hashtag_count[h["text"]] += 1
			else:
				self.hashtag_count[h["text"]] = 1
		if d_id in self.nodesdict and not self._is_dummy_node(d_id):

			if tweet["id"] not in self.nodesdict[d_id].tweet_ids:
				self.nodesdict[d_id].tweet_ids.append(tweet["id"])
				self.nodesdict[d_id].text.append(tweet["text"])
				self.nodesdict[d_id].score = self.nodesdict[d_id].score + 1
				for h in tweet["entities"]["hashtags"]:
					self.nodesdict[d_id].hashtags.append(h["text"])
				self.nodesdict[d_id].retweet_count = self.nodesdict[d_id].retweet_count + tweet["retweet_count"]
		else:
			self.nodesdict[d_id] = Gnode([], 1, d_id, tweet["user"]["followers_count"], tweet["retweet_count"], tweet["entities"]["hashtags"], tweet["text"], tweet["id"], tweet["user"]["screen_name"],group=self._handlegroup(tweet["user"]["screen_name"]))
			if tweet["is_quote_status"]:
				#print tweet

				for mention in tweet["entities"]["user_mentions"]:
					self._add_link(d_id, mention["id"], "mention")
					if mention["id"] not in self.nodesdict:
						self.nodesdict[mention["id"]] = Gnode([], 0, mention["id"], 0, 0, [], "", 0, mention["screen_name"], dummy=True, group=self._handlegroup(mention["screen_name"]))
				
				#self.nodesdict[d_id] = Gnode([], 1, d_id, tweet["user"]["followers_count"], tweet["retweet_count"], tweet["entities"]["hashtags"], tweet["text"], tweet["id"], tweet["user"]["screen_name"])
				if "quoted_status" in tweet:
					self._add_link(d_id, tweet["quoted_status"]["user"]["id"], "quoted")
					self._add_node(tweet["quoted_status"])
			elif "retweeted_status" in tweet:
				#self.nodesdict[d_id] = Gnode([], 1, d_id, tweet["user"]["followers_count"], tweet["retweet_count"], tweet["entities"]["hashtags"], tweet["text"], tweet["id"], tweet["user"]["screen_name"])
				self._add_link(d_id, tweet["retweeted_status"]["user"]["id"], "retweet")
				self._add_node(tweet["retweeted_status"])
			elif tweet["in_reply_to_screen_name"] != None:
				self._add_link(d_id, tweet["in_reply_to_user_id"], "reply")
				if tweet["in_reply_to_user_id"] not in self.nodesdict:
					self.nodesdict[tweet["in_reply_to_user_id"]] = Gnode([], 0, tweet["in_reply_to_user_id"], 0, 0, [], "", 0, tweet["in_reply_to_screen_name"], dummy=True, group=self._handlegroup(tweet["in_reply_to_screen_name"]))
				for mention in tweet["entities"]["user_mentions"][1:]:
					self._add_link(d_id, mention["id"], "mention")
					if mention["id"] not in self.nodesdict:
						self.nodesdict[mention["id"]] = Gnode([], 0, mention["id"], 0, 0, [], "", 0, mention["screen_name"], dummy=True, group=self._handlegroup(mention["screen_name"]))
			else:
				for mention in tweet["entities"]["user_mentions"]:
					self._add_link(d_id, mention["id"], "mention")
					if mention["id"] not in self.nodesdict:
						self.nodesdict[mention["id"]] = Gnode([], 0, mention["id"], 0, 0, [], "", 0, mention["screen_name"], dummy=True, group=self._handlegroup(mention["screen_name"]))
		return 1

	def graph_format(self, usergroups=[[]], readfile='', writefile=''):

		index = 0
		for h in usergroups:
			self.handledicts.append(dict())
			for d in h:
				self.handledicts[index][d] = 1

			index+=1 
		print(self.handledicts)

		
		f = open(readfile, "r")

		data = json.load(f)

		for  d in data:
			self._add_node(d)


		for key in self.nodesdict:
			self.tweet_graph["nodes"].append(self.nodesdict[key].json_print())

		for key in self.linksdict:
			self.tweet_graph["links"].append(self.linksdict[key])

		hasharr = []
		for key in self.hashtag_count:
			hasharr.append({
				"h": key,
				"score" : self.hashtag_count[key]
				})

		hasharr = sorted(hasharr, key=lambda hashobj: hashobj["score"], reverse=True)
		print (hasharr)


		graph_metrics = networkx.node_link_graph(self.tweet_graph, multigraph=False)

		node_metrics = networkx.betweenness_centrality(graph_metrics, weight="value")
		degree_metrics = networkx.degree_centrality(graph_metrics)
		harmonic_metrics = networkx.harmonic_centrality(graph_metrics, distance="value")


		for key in node_metrics:
			for n in self.tweet_graph["nodes"]:
				if n["id"] == key:
					n["graph_score"] = {
						"handle" : n["name"],
						"betweenness" : node_metrics[key],
						"degree" : degree_metrics[key],
						"harmonic" : harmonic_metrics[key]
					}
		wf = open(writefile, "w")
		self.tweet_graph["terms"] = hasharr
		json.dump(self.tweet_graph, wf, indent=4)

		return 1

	def get_handles(self, writepath=None):
		thatstr = "names,\n"
		follower_count = []

		for node in self.tweet_graph["nodes"]:

			follower_count.append({
				"n" : node["name"],
				"f" : node["followers_count"]
				})

			thatstr = thatstr + node["name"] + ",\n"

		follower_count = sorted(follower_count, key=lambda x: x["f"])


		#for f in follower_count:
		#	print f
		if writepath is not None:
			write1 = open(writepath, "w")

			write1.write(thatstr)
		return follower_count


if __name__ == "__main__":
	hashtag = sys.argv[1]
	


	d = TwitterTool()

	d.graph_format(readfile= hashtag + '.json', writefile=hashtag +"_network.json")