require 'sinatra'

get '/' do
    send_file File.join(settings.public_folder, 'index.html')
   // send_file File.expand_path('index.html', settings.public_folder)
end
