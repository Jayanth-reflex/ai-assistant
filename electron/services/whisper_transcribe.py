import sys
try:
    import whisper
except ImportError:
    print('Whisper not installed. Please run: pip install openai-whisper', file=sys.stderr)
    sys.exit(1)

if len(sys.argv) < 2:
    print('Usage: python whisper_transcribe.py <audio_path>', file=sys.stderr)
    sys.exit(1)

model = whisper.load_model('base')
result = model.transcribe(sys.argv[1])
print(result['text']) 