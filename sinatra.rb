require 'rubygems'
require 'bundler/setup'
require 'sinatra'

get '/' do
	File.read(File.join('public', 'koans.html'))
end

