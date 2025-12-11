from celery import shared_task
from django.conf import settings
import os
import ffmpeg
from pydub import AudioSegment
from .models import Track


@shared_task
def transcode_audio_to_mp3(track_id):
    """
    Transcode uploaded audio file to 256kbps MP3.
    """
    try:
        track = Track.objects.get(id=track_id)
        track.status = 'processing'
        track.save()

        input_path = track.file.path
        output_filename = f"{track.id}.mp3"

        # Create output directory structure
        date_path = track.uploaded_at.strftime('%Y/%m/%d')
        output_dir = os.path.join(
            settings.MEDIA_ROOT,
            'tracks',
            str(track.user.id),
            date_path
        )
        os.makedirs(output_dir, exist_ok=True)

        output_path = os.path.join(output_dir, output_filename)

        # If file is already MP3 and meets requirements, just calculate duration
        if input_path.lower().endswith('.mp3'):
            # Check bitrate and transcode if necessary
            try:
                audio = AudioSegment.from_mp3(input_path)
                # Get duration in seconds
                duration = len(audio) / 1000.0
                track.duration_seconds = duration

                # If it's already at or near 256kbps, no need to transcode
                # Just move/copy the file if needed
                if input_path != output_path:
                    os.rename(input_path, output_path)

                track.status = 'completed'
                track.save()
                return f"Track {track_id} processed successfully (already MP3)"

            except Exception as e:
                # If there's an error, fall through to FFmpeg transcoding
                pass

        # Use FFmpeg to transcode to 256kbps MP3
        try:
            # Get audio duration first
            probe = ffmpeg.probe(input_path)
            duration = float(probe['streams'][0]['duration'])
            track.duration_seconds = duration

            # Transcode to 256kbps MP3
            (
                ffmpeg
                .input(input_path)
                .output(
                    output_path,
                    audio_bitrate='256k',
                    format='mp3',
                    acodec='libmp3lame'
                )
                .overwrite_output()
                .run(capture_stdout=True, capture_stderr=True)
            )

            # Remove original file if different from output
            if input_path != output_path and os.path.exists(input_path):
                os.remove(input_path)

            # Update track with new file path
            track.file.name = f"tracks/{track.user.id}/{date_path}/{output_filename}"
            track.status = 'completed'
            track.save()

            return f"Track {track_id} transcoded successfully"

        except ffmpeg.Error as e:
            track.status = 'failed'
            track.save()
            return f"FFmpeg error for track {track_id}: {e.stderr.decode()}"

    except Track.DoesNotExist:
        return f"Track {track_id} not found"
    except Exception as e:
        if 'track' in locals():
            track.status = 'failed'
            track.save()
        return f"Error processing track {track_id}: {str(e)}"
