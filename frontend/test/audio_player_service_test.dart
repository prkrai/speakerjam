import 'package:flutter_test/flutter_test.dart';
import 'package:syncjam_frontend/audio_player_service.dart';

void main() {
  test('preload marks service ready', () async {
    final service = AudioPlayerService();
    await service.preload('https://example.test/song.mp3');
    expect(service.isReady, isTrue);
  });

  test('seek updates position', () async {
    final service = AudioPlayerService();
    await service.seek(12.5);
    expect(service.currentPosition(), 12.5);
  });
}
