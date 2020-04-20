FROM ubuntu:18.04

RUN apt update && \
    apt install -y octave python3 python3-pip

RUN octave --eval 'pkg install -forge nnet'

COPY . /

RUN pip3 install -r requirements.txt

CMD python3 server.py
