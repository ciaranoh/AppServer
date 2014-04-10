require 'rubygems'
require 'sinatra'
require 'open-uri'
require 'net/http'
require	'json'
require 'webrick'
require 'webrick/https'
require 'openssl'

#set :bind, '0.0.0.0'
#set :port, 5679

webrick_options = {
    :Port               => 5679,
    :SSLEnable          => true,
    :SSLVerifyClient    => OpenSSL::SSL::VERIFY_NONE,
    :SSLCertificate     => OpenSSL::X509::Certificate.new(  File.open(File.join(File.dirname(File.expand_path(__FILE__)), "../keys2/new-servercert.cer")).read),
    :SSLPrivateKey      => OpenSSL::PKey::RSA.new(          File.open(File.join(File.dirname(File.expand_path(__FILE__)), "../keys2/PRIVKEY2.PEM")).read),
    :SSLCertName        => [[ "CN", WEBrick::Utils::getservername ]]
}

# April Fool's joke from IETF, 1998
WEBrick::HTTPStatus::StatusMessage[418] = "I'm a teapot"

# Missing from WEBrick for some reason
WEBrick::HTTPStatus::StatusMessage[506] = "Variant Also Negotiates"
WEBrick::HTTPStatus::StatusMessage[508] = "Loop Detected"
WEBrick::HTTPStatus::StatusMessage[509] = "Bandwith Limit Exceeded"
WEBrick::HTTPStatus::StatusMessage[510] = "Not Extended"

class AppServer < Sinatra::Base
    get '/hello_world' do
        open(File.join(File.dirname(File.expand_path(__FILE__)), 'hello world.html')).read
    end

    get '/hello_world_redirect' do
        redirect '/hello_world'
    end

    get '/gallery' do
        open(File.join(File.dirname(File.expand_path(__FILE__)), 'gallery.html')).read
    end

    get '/login_form' do
        open(File.join(File.dirname(File.expand_path(__FILE__)), 'login.html')).read
    end

    post '/process_login' do
        "username was '#{params['username']}', password was '#{params['password']}'"
    end

    get '/images/*' do
        image = params[:splat] ? "#{params[:splat].first}" : nil
        send_file (File.join(File.dirname(File.expand_path(__FILE__)), "images/#{image}"))
    end

    get '/verb' do
        response.headers["Received-Method"] = "GET"
        "{verb: \"GET\"}"
    end

    post '/verb' do
        response.headers["Received-Method"] = "POST"
        body = request.body.read.to_s
        "{verb: \"POST\", body: \"#{body}\"}"
    end

    put '/verb' do
        response.headers["Received-Method"] = "PUT"
        body = request.body.read.to_s
        "{verb: \"PUT\", body: \"#{body}\"}"
    end

    delete '/verb' do
        response.headers["Received-Method"] = "DELETE"
        "{verb: \"DELETE\"}"
    end

    options '/verb' do
        response.headers["Received-Method"] = "OPTIONS"
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "HEAD, GET, PUT, POST, DELETE, OPTIONS"
        "{verb: \"OPTIONS\", options: [\"HEAD\", \"GET\", \"PUT\", \"POST\", \"DELETE\", \"OPTIONS\"]}"
    end

    get '/etags' do
        headers = env.to_hash
        headers['ETag'] = 'a7c876b7e686897696'
        response = JSON.generate({:headers=> headers})
		puts response
		response
    end

    get '/' do
        "document at root"
    end

    get '/status/*' do
        code = params[:splat] ? "#{params[:splat].first}".to_i : 200
        puts code
        status code
    end
	get '/5k' do
        open(File.join(File.dirname(File.expand_path(__FILE__)), 'LoadTesting/5k.html')).read
    end
	get '/10k' do
        open(File.join(File.dirname(File.expand_path(__FILE__)), 'LoadTesting/10k.html')).read
    end
	get '/10k_with_images' do
        send_file (File.join(File.dirname(File.expand_path(__FILE__)), 'LoadTesting/10k_with_images.html'))
    end
	get '/15k' do
        open(File.join(File.dirname(File.expand_path(__FILE__)), 'LoadTesting/15k.html')).read
    end
	get '/15k_with_images' do
        open(File.join(File.dirname(File.expand_path(__FILE__)), 'LoadTesting/15k_with_images.html')).read
    end
	get '/25k' do
        open(File.join(File.dirname(File.expand_path(__FILE__)), 'LoadTesting/25k.html')).read
    end
	get '/50k' do
        open(File.join(File.dirname(File.expand_path(__FILE__)), 'LoadTesting/50k.html')).read
    end
	get '/100k' do
        open(File.join(File.dirname(File.expand_path(__FILE__)), 'LoadTesting/100k.html')).read
    end
    get '/250k' do
        open(File.join(File.dirname(File.expand_path(__FILE__)), 'LoadTesting/250k.html')).read
    end
	
	get '/LoadTesting/images/*' do
		image = params[:splat] ? "#{params[:splat].first}" : nil
        send_file (File.join(File.dirname(File.expand_path(__FILE__)), "/LoadTesting/images/#{image}"))
	end
	
	get '/jquery_demo' do
		send_file (File.join(File.dirname(File.expand_path(__FILE__)), 'jquery_demo/haha.html'))
	end
	
	get '/jquery_demo/*' do 
		resource = params[:splat] ? "#{params[:splat].first}" : nil
        send_file (File.join(File.dirname(File.expand_path(__FILE__)), "jquery_demo/#{resource}"))
	end
end

server = ::Rack::Handler::WEBrick
trap(:INT) do
    server.shutdown
end
server.run(AppServer, webrick_options)