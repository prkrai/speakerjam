import 'package:flutter_test/flutter_test.dart';
import 'package:syncjam_frontend/playback_clock.dart';

void main() {
  test('converts server time using offset', () {
    final clock = PlaybackClock(offsetMs: 5.0);
    final local = clock.convertServerTimeToLocal(1000);
    expect(local.millisecondsSinceEpoch, 1005);
  });
}
